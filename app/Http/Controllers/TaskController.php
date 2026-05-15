<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::orderBy('is_done')
                    ->latest()
                    ->get();
        return view('dashboard', compact('tasks'));
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $user = User::findOrFail(Auth::id());
        $task = $user->tasks()->create([
            'title' => $request->title,
        ]);

        if ($request->expectsJson()) {
            return response()->json($task);
        }

        return redirect()->route('dashboard');
    }

    public function update(Request $request, Task $task)
    {
        $user = User::findOrFail(Auth::id());
        if ($task->user_id !== $user->id) abort(403);

        if ($request->has('toggle_status')) {
            $task->update([
                'is_done' => !$task->is_done
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) { abort(403); }

        $task->delete();

        if (request()->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->route('dashboard');
    }
}
