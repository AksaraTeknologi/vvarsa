<?php

namespace App\Http\Controllers\Owner;

use App\Events\MemberRequestReviewedEvent;
use App\Events\MemberRequestSubmittedEvent;
use App\Http\Controllers\Controller;
use App\Models\MemberRequest;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(): Response
    {
        $tenant = app('tenant');
        $user = auth()->user();

        $members = User::where(function ($query) use ($tenant) {
            $query->where('tenant_id', $tenant->id)
                ->orWhereHas('tenants', fn ($q) => $q->where('tenants.id', $tenant->id));
        })
            ->distinct()
            ->with('roles')
            ->latest()
            ->get();

        $roles = Role::whereIn('name', ['owner', 'supervisor', 'staff'])->get();

        // Permintaan pending — hanya owner yang bisa lihat & aksi
        $pendingRequests = [];
        $availableSupervisors = [];

        if ($user->hasRole('owner')) {
            $pendingRequests = MemberRequest::where('tenant_id', $tenant->id)
                ->where('status', 'pending')
                ->with('requestedBy:id,name,email')
                ->latest()
                ->get();

            // Ambil semua tenant milik owner ini
            $ownerTenantIds = Tenant::where('owner_id', $user->id)->pluck('id');

            // Cari supervisor dari tenant lain milik owner yang belum ada di tenant aktif
            $availableSupervisors = User::role('supervisor')
                ->where('id', '!=', $user->id)
                ->where(function ($query) use ($ownerTenantIds) {
                    $query->whereIn('tenant_id', $ownerTenantIds)
                        ->orWhereHas('tenants', fn ($q) => $q->whereIn('tenants.id', $ownerTenantIds));
                })
                ->where('tenant_id', '!=', $tenant->id)
                ->whereDoesntHave('tenants', fn ($q) => $q->where('tenants.id', $tenant->id))
                ->distinct()
                ->with(['tenant:id,name', 'tenants' => fn ($q) => $q->whereIn('tenants.id', $ownerTenantIds)])
                ->get(['id', 'name', 'email', 'tenant_id'])
                ->map(function ($sup) {
                    $tenantNames = collect([$sup->tenant?->name])
                        ->merge($sup->tenants->pluck('name'))
                        ->filter()
                        ->unique()
                        ->values()
                        ->all();

                    return [
                        'id' => $sup->id,
                        'name' => $sup->name,
                        'email' => $sup->email,
                        'tenant_names' => $tenantNames,
                    ];
                })
                ->values()
                ->all();
        }

        // Cek apakah sudah ada supervisor di tenant ini
        $hasSupervisor = User::role('supervisor')
            ->where(function ($query) use ($tenant) {
                $query->where('tenant_id', $tenant->id)
                    ->orWhereHas('tenants', fn ($q) => $q->where('tenants.id', $tenant->id));
            })
            ->exists();

        return Inertia::render('owner/members/index', [
            'members' => $members,
            'roles' => $roles,
            'limit' => $tenant->max_users,
            'member_count' => $members->count(),
            'pending_requests' => $pendingRequests,
            'available_supervisors' => $availableSupervisors,
            'is_supervisor' => $user->hasRole('supervisor'),
            'is_owner' => $user->hasRole('owner'),
            'has_supervisor' => $hasSupervisor,
        ]);
    }

    public function store(Request $request)
    {
        $tenant = app('tenant');
        $user = auth()->user();

        if (! $tenant->canAddUser()) {
            return back()->with('error', "Batas jumlah pengguna ({$tenant->max_users}) sudah tercapai. Silakan upgrade paket langganan Anda.");
        }

        // ── Supervisor: buat pending request, tidak langsung buat user ────────
        if ($user->hasRole('supervisor')) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email|unique:member_requests,email',
                'password' => ['required', Rules\Password::defaults()],
                'role' => 'required|in:staff',
            ]);

            $memberRequest = MemberRequest::create([
                'tenant_id' => $tenant->id,
                'requested_by' => $user->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => 'pending',
            ]);

            broadcast(new MemberRequestSubmittedEvent($memberRequest));

            return back()->with('success', 'Permintaan penambahan anggota berhasil dikirim. Menunggu persetujuan owner.');
        }

        // ── Owner: langsung buat user ─────────────────────────────────────────
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', Rules\Password::defaults()],
            'role' => 'required|in:supervisor,staff',
        ]);

        if ($validated['role'] === 'supervisor') {
            $hasSupervisor = User::role('supervisor')
                ->where(function ($query) use ($tenant) {
                    $query->where('tenant_id', $tenant->id)
                        ->orWhereHas('tenants', fn ($q) => $q->where('tenants.id', $tenant->id));
                })
                ->exists();

            if ($hasSupervisor) {
                return back()->with('error', 'Hanya boleh ada 1 Supervisor dalam satu tenant.');
            }
        }

        $newUser = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tenant_id' => $tenant->id,
            'is_active' => true,
        ]);

        $newUser->assignRole($validated['role']);
        $tenant->users()->syncWithoutDetaching([$newUser->id]);

        return back()->with('success', 'Pengguna berhasil ditambahkan ke tim Anda.');
    }

    /**
     * Daftarkan/import supervisor dari tenant lain milik owner yang sama.
     */
    public function importSupervisor(Request $request)
    {
        $tenant = app('tenant');
        $user = auth()->user();

        abort_if(! $user->hasRole('owner'), 403, 'Hanya owner yang dapat mendaftarkan supervisor.');

        $validated = $request->validate([
            'supervisor_id' => 'required|uuid|exists:users,id',
        ]);

        if (! $tenant->canAddUser()) {
            return back()->with('error', "Batas jumlah pengguna ({$tenant->max_users}) sudah tercapai. Silakan upgrade paket langganan Anda.");
        }

        $hasSupervisor = User::role('supervisor')
            ->where(function ($query) use ($tenant) {
                $query->where('tenant_id', $tenant->id)
                    ->orWhereHas('tenants', fn ($q) => $q->where('tenants.id', $tenant->id));
            })
            ->exists();

        if ($hasSupervisor) {
            return back()->with('error', 'Hanya boleh ada 1 Supervisor dalam satu tenant.');
        }

        $supervisor = User::findOrFail($validated['supervisor_id']);

        if (! $supervisor->hasRole('supervisor')) {
            return back()->with('error', 'Pengguna yang dipilih bukan seorang supervisor.');
        }

        // Pastikan supervisor memang terdaftar di setidaknya satu tenant milik owner ini
        $ownerTenantIds = Tenant::where('owner_id', $user->id)->pluck('id');
        $isFromSameOwner = $ownerTenantIds->contains($supervisor->tenant_id)
            || $supervisor->tenants()->whereIn('tenants.id', $ownerTenantIds)->exists();

        if (! $isFromSameOwner) {
            return back()->with('error', 'Supervisor tidak berasal dari bisnis milik Anda.');
        }

        // Cek apakah sudah terdaftar di tenant ini
        $isAlreadyMember = $supervisor->tenant_id === $tenant->id
            || $tenant->users()->where('users.id', $supervisor->id)->exists();

        if ($isAlreadyMember) {
            return back()->with('error', 'Supervisor ini sudah terdaftar di bisnis ini.');
        }

        // Attach supervisor ke tenant aktif
        $tenant->users()->syncWithoutDetaching([$supervisor->id]);

        return back()->with('success', "Supervisor {$supervisor->name} berhasil didaftarkan ke {$tenant->name}.");
    }

    /**
     * Owner menyetujui permintaan supervisor.
     */
    public function approve(MemberRequest $memberRequest)
    {
        $tenant = app('tenant');

        // Proteksi: hanya owner yang bisa approve
        abort_if(! auth()->user()->hasRole('owner'), 403);

        // Pastikan request milik tenant yang sama
        abort_if($memberRequest->tenant_id !== $tenant->id, 403);

        // Pastikan masih pending
        if (! $memberRequest->isPending()) {
            return back()->with('error', 'Permintaan ini sudah diproses sebelumnya.');
        }

        // Cek kuota user
        if (! $tenant->canAddUser()) {
            return back()->with('error', "Batas jumlah pengguna ({$tenant->max_users}) sudah tercapai.");
        }

        // Cek jika request adalah supervisor dan sudah ada supervisor di tenant
        if ($memberRequest->role === 'supervisor') {
            $hasSupervisor = User::role('supervisor')
                ->where(function ($query) use ($tenant) {
                    $query->where('tenant_id', $tenant->id)
                        ->orWhereHas('tenants', fn ($q) => $q->where('tenants.id', $tenant->id));
                })
                ->exists();

            if ($hasSupervisor) {
                return back()->with('error', 'Gagal menyetujui: Hanya boleh ada 1 Supervisor dalam satu tenant.');
            }
        }

        // Cek email belum dipakai
        if (User::where('email', $memberRequest->email)->exists()) {
            $memberRequest->update([
                'status' => 'rejected',
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
            ]);

            return back()->with('error', "Email {$memberRequest->email} sudah digunakan. Permintaan ditolak otomatis.");
        }

        // Buat user baru dari data request
        $newUser = User::create([
            'name' => $memberRequest->name,
            'email' => $memberRequest->email,
            'password' => $memberRequest->password, // sudah di-hash
            'tenant_id' => $tenant->id,
            'is_active' => true,
        ]);

        $newUser->assignRole($memberRequest->role);
        $tenant->users()->syncWithoutDetaching([$newUser->id]);

        // Tandai request sebagai approved
        $memberRequest->update([
            'status' => 'approved',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        broadcast(new MemberRequestReviewedEvent($memberRequest->fresh()));

        return back()->with('success', "Permintaan disetujui. {$memberRequest->name} berhasil ditambahkan ke tim.");
    }

    /**
     * Owner menolak permintaan supervisor.
     */
    public function reject(MemberRequest $memberRequest)
    {
        $tenant = app('tenant');

        abort_if(! auth()->user()->hasRole('owner'), 403);
        abort_if($memberRequest->tenant_id !== $tenant->id, 403);

        if (! $memberRequest->isPending()) {
            return back()->with('error', 'Permintaan ini sudah diproses sebelumnya.');
        }

        $memberRequest->update([
            'status' => 'rejected',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        broadcast(new MemberRequestReviewedEvent($memberRequest->fresh()));

        return back()->with('success', "Permintaan penambahan {$memberRequest->name} telah ditolak.");
    }

    public function update(Request $request, User $member)
    {
        $tenant = app('tenant');

        // Ensure user belongs to same tenant
        $isMember = $member->tenant_id === $tenant->id
            || $tenant->users()->where('users.id', $member->id)->exists();

        if (! $isMember) {
            abort(403);
        }

        // Hanya owner yang bisa ubah role
        abort_if(! auth()->user()->hasRole('owner'), 403, 'Hanya owner yang dapat mengubah peran anggota.');

        // Owner cannot change their own role to prevent lockout
        if ($member->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat mengubah peran Anda sendiri.');
        }

        $validated = $request->validate([
            'role' => 'required|in:owner,supervisor,staff',
        ]);

        if ($validated['role'] === 'supervisor') {
            $hasSupervisor = User::role('supervisor')
                ->where(function ($query) use ($tenant) {
                    $query->where('tenant_id', $tenant->id)
                        ->orWhereHas('tenants', fn ($q) => $q->where('tenants.id', $tenant->id));
                })
                ->where('id', '!=', $member->id)
                ->exists();

            if ($hasSupervisor) {
                return back()->with('error', 'Hanya boleh ada 1 Supervisor dalam satu tenant.');
            }
        }

        $member->syncRoles([$validated['role']]);

        return back()->with('success', "Peran {$member->name} berhasil diperbarui.");
    }

    public function destroy(User $member)
    {
        $tenant = app('tenant');

        // Ensure user belongs to same tenant
        $isMember = $member->tenant_id === $tenant->id
            || $tenant->users()->where('users.id', $member->id)->exists();

        if (! $isMember) {
            abort(403);
        }

        // Hanya owner yang bisa hapus
        abort_if(! auth()->user()->hasRole('owner'), 403, 'Hanya owner yang dapat menghapus anggota.');

        // Cannot delete self
        if ($member->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        // Detach dari tenant aktif
        $tenant->users()->detach($member->id);

        // Jika user masih punya asosiasi dengan tenant lain, pindahkan tenant_id aktif jika sama dengan tenant ini
        $otherTenant = $member->tenants()->where('tenants.id', '!=', $tenant->id)->first();
        if ($otherTenant) {
            if ($member->tenant_id === $tenant->id) {
                $member->update(['tenant_id' => $otherTenant->id]);
            }
        } else {
            // Jika tidak ada tenant lain dan bukan owner, hapus user
            $member->delete();
        }

        return back()->with('success', "Pengguna {$member->name} berhasil dihapus dari tim.");
    }
}
