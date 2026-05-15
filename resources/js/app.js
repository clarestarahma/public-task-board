import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

// resources/js/app.js

// --- FUNGSI HELPER CREATE TASK ROW ---
function createTaskRow(task) {
    const tr = document.createElement('tr');
    tr.dataset.id = task.id;
    
    // Gunakan logika yang sama dengan Blade untuk menentukan warna dan teks
    const statusClass = task.is_done 
        ? 'bg-black text-white hover:bg-gray-700' 
        : 'bg-white text-gray-600 border border-gray-300 hover:border-black hover:text-black';
    
    const statusText = task.is_done ? '✓ Done' : 'Mark Done';

    tr.innerHTML = `
        <td class="px-6 py-4">
            <span class="text-black">${task.title}</span>
        </td>
        <td class="px-6 py-4">
            <button onclick="toggleTask(${task.id})"
                class="text-xs font-semibold px-4 py-1 rounded-full transition ${statusClass}">
                ${statusText}
            </button>
        </td>
        <td class="px-6 py-4 text-right">
            <button onclick="deleteTask(${task.id})"
                class="text-gray-400 hover:text-red-500 transition-colors">
                Delete
            </button>
        </td>
    `;
    return tr;
}


// --- 1. FUNGSI ADD (AJAX) ---
const addBtn = document.getElementById('add-task');
if (addBtn) {
    addBtn.addEventListener('click', async function () {
        const input = document.getElementById('new-task');
        if (!input.value) return;

        try {
            const res = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ title: input.value })
            });

            if (!res.ok) throw new Error('Gagal menambahkan task');
            const task = await res.json(); // Controller harus return task baru
            const tbody = document.querySelector('tbody');

            // Hapus "No tasks yet" kalau ada
            const empty = tbody.querySelector('td[colspan="3"]');
            if (empty) empty.closest('tr').remove();

            // Buat baris baru
            const tr = createTaskRow(task);

            const doneRow = [...tbody.querySelectorAll('tr')].find(tr => 
                tr.querySelector('button')?.textContent.trim() === '✓ Done'
            );

            if (doneRow) {
                tbody.insertBefore(tr, doneRow); // Sisip sebelum yang done
            } else {
                tbody.appendChild(tr); // Kalau belum ada yang done, taruh di bawah
            }

            input.value = ''; // Reset input

            
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan, coba lagi.');
        }
    });
}


// --- 2. FUNGSI TOGGLE DONE (AJAX) ---
window.toggleTask = async function(id) {
    try {
        const res = await fetch(`/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ toggle_status: true })
        });

        if (!res.ok) throw new Error('Gagal mengubah status task');
        const row = document.querySelector(`tr[data-id="${id}"]`);
        const tbody = row.closest('tbody');
        const span = row.querySelector('td:first-child span');
        const btn = row.querySelector('td:nth-child(2) button');
        const isDone = span.classList.contains('line-through');

        if (isDone) {
            // Kembalikan ke belum done
            row.classList.remove('bg-gray-50');
            span.classList.remove('line-through', 'text-gray-400');
            span.classList.add('text-black');
            btn.classList.remove('bg-black', 'text-white');
            btn.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-300');
            btn.textContent = 'Mark Done';
            tbody.prepend(row);
        } else {
            // Jadikan done
            row.classList.add('bg-gray-50');
            span.classList.add('line-through', 'text-gray-400');
            span.classList.remove('text-black');
            btn.classList.add('bg-black', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-300');
            btn.textContent = '✓ Done';
            tbody.appendChild(row);
        }

    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan, coba lagi.');
    }
}

// --- 3. FUNGSI DELETE (AJAX) ---
window.deleteTask = async function(id) {
    if (!confirm('Yakin mau hapus?')) return;

    try {
        const res = await fetch(`/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) throw new Error('Gagal menghapus task');
        document.querySelector(`tr[data-id="${id}"]`).remove();

    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan, coba lagi.');
    }
}