<?php

namespace App\Http\Controllers;

use App\Events\CommunityReplyReceivedEvent;
use App\Models\CommunityMembership;
use App\Models\CommunityPost;
use App\Models\CommunityPostLike;
use App\Models\CommunityReply;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    public function index(Request $request): Response
    {
        $tenant = app('tenant');

        $query = CommunityPost::with(['user:id,name,tenant_id', 'tenant:id,name'])
            ->where('is_active', true)
            ->where('business_type', $tenant->business_type);

        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }

        if ($search = $request->get('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        $posts = $query->orderByDesc('is_pinned')->latest()->paginate(10)->withQueryString();

        $likedPostIds = CommunityPostLike::where('user_id', auth()->id())
            ->pluck('post_id')->toArray();

        return Inertia::render('community/index', [
            'posts' => $posts,
            'liked_post_ids' => $likedPostIds,
            'filters' => $request->only(['category', 'search']),
            'tenant_business_type' => $tenant->business_type,
        ]);
    }

    public function join(CommunityPost $post)
    {
        $tenant = app('tenant');
        $this->ensurePostBusinessType($post, $tenant->business_type);

        CommunityMembership::firstOrCreate([
            'user_id' => auth()->id(),
            'post_id' => $post->id,
        ]);

        return back()->with('success', 'Anda berhasil bergabung ke komunitas.');
    }

    public function leave(CommunityPost $post)
    {
        $tenant = app('tenant');
        $this->ensurePostBusinessType($post, $tenant->business_type);

        CommunityMembership::where('user_id', auth()->id())
            ->where('post_id', $post->id)
            ->delete();

        return back()->with('success', 'Anda keluar dari komunitas.');
    }

    public function show(CommunityPost $post): Response
    {
        $tenant = app('tenant');

        // Pastikan post sesuai dengan business_type tenant
        if ($post->business_type !== $tenant->business_type) {
            abort(403, 'Anda tidak bisa mengakses komunitas bisnis lain.');
        }

        $post->increment('views_count');

        $post->load(['user:id,name,tenant_id', 'tenant:id,name']);
        $replies = CommunityReply::where('post_id', $post->id)
            ->where('is_active', true)
            ->with(['user:id,name'])
            ->orderBy('created_at')
            ->get();

        $isLiked = CommunityPostLike::where('post_id', $post->id)
            ->where('user_id', auth()->id())->exists();
        $isMember = CommunityMembership::where('user_id', auth()->id())
            ->where('post_id', $post->id)
            ->exists();

        return Inertia::render('community/show', [
            'post' => $post,
            'replies' => $replies,
            'is_liked' => $isLiked,
            'tenant_business_type' => $tenant->business_type,
            'is_member' => $isMember,
        ]);
    }

    public function create(): Response
    {
        $tenant = app('tenant');

        return Inertia::render('community/create', [
            'tenant_business_type' => $tenant->business_type,
        ]);
    }

    public function store(Request $request)
    {
        $tenant = app('tenant');
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|in:discussion,question,tips,announcement',
        ]);

        $post = CommunityPost::create(array_merge($validated, [
            'tenant_id' => $tenant->id,
            'user_id' => auth()->id(),
            'business_type' => $tenant->business_type,
        ]));

        CommunityMembership::firstOrCreate([
            'user_id' => auth()->id(),
            'post_id' => $post->id,
        ]);

        return redirect()->route('community.show', $post)->with('success', 'Diskusi berhasil dibuat!');
    }

    public function reply(Request $request, CommunityPost $post)
    {
        $tenant = app('tenant');
        // Pastikan post sesuai dengan business_type tenant
        if ($post->business_type !== $tenant->business_type) {
            abort(403, 'Anda tidak bisa membalas diskusi komunitas bisnis lain.');
        }
        $this->ensureMember($post->id);

        $validated = $request->validate([
            'content' => 'required|string|min:2',
        ]);

        $reply = CommunityReply::create([
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'content' => $validated['content'],
        ]);

        $post->increment('replies_count');

        broadcast(new CommunityReplyReceivedEvent($reply->load('post')));

        return back()->with('success', 'Balasan berhasil ditambahkan.');
    }

    public function toggleLike(CommunityPost $post)
    {
        $tenant = app('tenant');

        // Pastikan post sesuai dengan business_type tenant
        if ($post->business_type !== $tenant->business_type) {
            abort(403, 'Anda tidak bisa menyukai diskusi komunitas bisnis lain.');
        }

        $existing = CommunityPostLike::where('post_id', $post->id)
            ->where('user_id', auth()->id())->first();

        if ($existing) {
            $existing->delete();
            $post->decrement('likes_count');
            $liked = false;
        } else {
            CommunityPostLike::create(['post_id' => $post->id, 'user_id' => auth()->id()]);
            $post->increment('likes_count');
            $liked = true;
        }

        return back()->with('liked', $liked);
    }

    private function ensureMember(string $postId): void
    {
        abort_unless(
            CommunityMembership::where('user_id', auth()->id())
                ->where('post_id', $postId)
                ->exists(),
            403,
            'Anda harus bergabung ke komunitas terlebih dahulu.'
        );
    }

    private function ensurePostBusinessType(CommunityPost $post, string $businessType): void
    {
        abort_if($post->business_type !== $businessType, 403, 'Anda tidak bisa mengakses komunitas bisnis lain.');
    }
}
