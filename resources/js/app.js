import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

// resources/js/app.js

// --- FUNGSI HELPER CREATE TASK ROW ---
function createTaskRow(task) {
    const tr = document.createElement('tr');
    tr.dataset.id = task.id;

    const spanClass = task.is_done ? 'line-through text-gray-400' : 'text-black';
    const rowClass = task.is_done ? 'bg-gray-50' : '';
    
    if(rowClass) tr.classList.add(rowClass);
    
    const statusClass = task.is_done 
        ? 'bg-black text-white hover:bg-gray-700' 
        : 'bg-white text-gray-600 border border-gray-300 hover:border-black hover:text-black';
    
    const statusText = task.is_done ? '✓ Done' : 'Mark Done';

    tr.innerHTML = `
        <td class="px-6 py-4">
            <span class="${spanClass}">${task.title}</span>  <!-- !! FIX DI SINI: Gunakan variabel spanClass !! -->
        </td>
        <td class="px-6 py-4 text-center"> <!-- !! TAMBAHKAN text-center agar sama dengan Blade !! -->
            <button onclick="toggleTask(${task.id})"
                class="text-xs font-semibold px-4 py-1 rounded-full transition-all duration-200 inline-flex items-center justify-center ${statusClass}">
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

        if (!res.ok) throw new Error('Gagal update');

        const row = document.querySelector(`tr[data-id="${id}"]`);
        const span = row.querySelector('td:first-child span');
        const btn = row.querySelector('button[onclick^="toggleTask"]');
        const tbody = row.closest('tbody');

        // !! PEMBETULAN: Cek status pakai teks tombol agar lebih pasti !!
        const isCurrentlyDone = btn.textContent.trim().includes('Done');

        if (isCurrentlyDone && btn.classList.contains('bg-black')) {
            // PROSES UN-DONE (Balik jadi putih)
            row.classList.remove('bg-gray-50');
            span.className = "text-black";
            
            // Paksa reset class agar warna hitamnya hilang total
            btn.className = "text-xs font-semibold px-4 py-1 rounded-full transition-all duration-200 inline-flex items-center justify-center bg-white text-gray-600 border border-gray-300 hover:border-black hover:text-black";
            btn.textContent = 'Mark Done';
            
            tbody.prepend(row); 
        } else {
            // PROSES DONE (Jadi hitam)
            row.classList.add('bg-gray-50');
            span.className = "line-through text-gray-400";
            
            // Paksa jadi hitam
            btn.className = "text-xs font-semibold px-4 py-1 rounded-full transition-all duration-200 inline-flex items-center justify-center bg-black text-white hover:bg-gray-700";
            btn.textContent = '✓ Done';
            
            tbody.appendChild(row);
        }
    } catch (err) {
        console.error(err);
    }
}

// --- 3. FUNGSI DELETE (AJAX) ---
window.deleteTask = async function(id) {
    // Tambahkan konfirmasi agar tidak tidak sengaja terhapus
    if (!confirm('Yakin ingin menghapus tugas ini?')) return;

    try {
        const res = await fetch(`/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                // Pastikan token CSRF terambil dengan benar dari meta tag
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) throw new Error('Gagal menghapus data di server');
        
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            row.remove();
        }

        const tbody = document.querySelector('tbody');
        if (tbody && tbody.children.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="px-6 py-6 text-center text-gray-400">
                        No tasks yet.
                    </td>
                </tr>
            `;
        }

    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat menghapus task.');
    }
}