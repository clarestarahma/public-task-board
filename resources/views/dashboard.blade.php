<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Public Task Board') }}
        </h2>
    </x-slot>

    <div class="py-10 bg-gray-100 min-h-screen">
        <div class="max-w-4xl mx-auto px-6">

            {{-- New Task --}}
            @auth
            <div class="mb-6 flex gap-3">
                <div class="flex w-full gap-3">
                    <input id="new-task" type="text" placeholder="Add a new public task..."
                        class="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2">

                    <button id="add-task"
                        class="bg-gray-800 text-white px-6 rounded-lg">
                        + Add
                    </button>
                </div>
            </div>
            @endauth

            {{-- Table --}}
            <div class="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                            <th class="px-6 py-3">Task</th>
                            <th class="px-6 py-3 w-32">Status</th>
                            <th class="px-6 py-3 w-32">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        @forelse($tasks as $task)
                            <tr data-id="{{ $task->id }}" class="{{ $task->is_done ? 'bg-gray-50' : '' }}">
                                <td class="px-6 py-4">
                                    <span class="{{ $task->is_done ? 'line-through text-gray-400' : 'text-black' }}">
                                        {{ $task->title }}
                                    </span>
                                </td>

                                <td class="px-6 py-4 text-center"> {{-- Tambah text-center di sini agar konten di tengah --}}
                                    @auth
                                        {{-- Tampilan USER (Bisa diklik) --}}
                                        <button onclick="toggleTask({{ $task->id }})"
                                            class="text-xs font-semibold px-4 py-1 rounded-full transition-all duration-200 inline-flex items-center justify-center
                                            {{ $task->is_done 
                                                ? 'bg-black text-white hover:bg-gray-700' 
                                                : 'bg-white text-gray-600 border border-gray-300 hover:border-black hover:text-black' }}">
                                            {{ $task->is_done ? '✓ Done' : 'Mark Done' }}
                                        </button>
                                    @else
                                        {{-- Tampilan GUEST (Abu-abu, Tengah, & Ada Hint) --}}
                                        <span 
                                            title="Silakan login untuk melakukan update status" {{-- Hint saat di-hover --}}
                                            class="text-xs font-semibold px-4 py-1 rounded-full inline-block cursor-help transition-colors
                                            {{ $task->is_done 
                                                ? 'bg-gray-200 text-gray-500' 
                                                : 'bg-gray-50 text-gray-400 border border-gray-200' }}">
                                            {{ $task->is_done ? '✓ Done' : 'Mark Done' }}
                                        </span>
                                    @endauth
                                </td>

                                <td class="px-6 py-4 text-right">
                                    @auth
                                        <button onclick="deleteTask({{ $task->id }})" 
                                            class="text-gray-400 hover:text-red-500 transition-colors">
                                            Delete
                                        </button>
                                    @else
                                        <span class="text-gray-300 text-xs italic">Locked</span>
                                    @endauth
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="px-6 py-6 text-center text-gray-400">
                                    No tasks yet.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</x-app-layout>
