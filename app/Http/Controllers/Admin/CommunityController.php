<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    public function index(Request $request): Response
    {
        $query = CommunityPost::with(['user:id,name', 'tenant:id,name']);

        if ($search = $request->get('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }

        if ($status = $request->get('status')) {
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        if ($businessType = $request->get('business_type')) {
            $query->where('business_type', $businessType);
        }

        $posts = $query->orderByDesc('is_pinned')->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/community/index', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'category', 'status', 'business_type']),
        ]);
    }

    public function togglePin(CommunityPost $post): RedirectResponse
    {
        $post->update(['is_pinned' => ! $post->is_pinned]);

        return back()->with('success', $post->is_pinned ? 'Post berhasil disematkan.' : 'Post berhasil dilepas.');
    }

    public function toggleActive(CommunityPost $post): RedirectResponse
    {
        $post->update(['is_active' => ! $post->is_active]);

        return back()->with('success', $post->is_active ? 'Post berhasil diaktifkan.' : 'Post berhasil dinonaktifkan.');
    }

    public function destroy(CommunityPost $post): RedirectResponse
    {
        $post->delete();

        return back()->with('success', 'Post berhasil dihapus.');
    }
}
