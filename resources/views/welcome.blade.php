<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    @vite('resources/css/app.css')
</head>

<body class="bg-neutral-950 text-neutral-200 min-h-screen flex items-center justify-center">

    <div class="text-center px-6">
        <h1 class="text-5xl font-bold mb-6 tracking-wide text-white">
            Task Manager
        </h1>

        <p class="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
            A simple application to organize your daily tasks,
            stay focused, and improve your productivity.
        </p>

        <div class="flex justify-center gap-6">
            <a href="/login"
               class="px-8 py-3 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition">
                Login
            </a>

            <a href="/register"
               class="px-8 py-3 rounded-lg border border-neutral-600 hover:border-white hover:text-white transition">
                Register
            </a>
        </div>
    </div>

</body>
</html>