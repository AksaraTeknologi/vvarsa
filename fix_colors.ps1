$content = Get-Content 'resources/js/pages/welcome.tsx' -Raw -Encoding UTF8

# Ecosystem section background & header
$content = $content -replace 'bg-\[#fffdf8\] border-y-4 border-\[#0f172a\]', 'bg-white border-y-3 border-[#E8E6FF]'
$content = $content -replace [regex]::Escape('bg-[#fb0001] px-4 py-1.5 text-xs font-black uppercase text-white shadow-md'), 'bg-[#5E4BF2] px-4 py-1.5 text-xs font-black uppercase text-white shadow-md'
$content = $content -replace [regex]::Escape('text-[#0f172a] sm:text-5xl lg:text-6xl'), 'text-[#2D3142] sm:text-5xl lg:text-6xl'
$content = $content -replace [regex]::Escape('font-extrabold text-[#475569] sm:text-lg'), 'font-semibold text-[#64748B] sm:text-lg'

# Card 1: blue -> purple
$content = $content -replace [regex]::Escape('border-[#1777fb] bg-white/95 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(23,119,251,0.2)]'), 'border-[#5E4BF2]/40 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(94,75,242,0.15)]'
$content = $content -replace [regex]::Escape('bg-[#1777fb] text-white shadow-md'), 'bg-[#5E4BF2] text-white shadow-md'
$content = $content -replace [regex]::Escape('bg-[#eef5ff] border border-[#1777fb]/30 px-3 py-1 text-xs font-black text-[#1777fb]'), 'bg-[#F1EFFD] border border-[#5E4BF2]/30 px-3 py-1 text-xs font-black text-[#5E4BF2]'
$content = $content -replace [regex]::Escape('mt-6 rounded-2xl border-2 border-[#1777fb]/20 bg-[#eef5ff]'), 'mt-6 rounded-2xl border-2 border-[#5E4BF2]/15 bg-[#F1EFFD]'
$content = $content -replace [regex]::Escape('text-xs font-black text-[#1777fb]'), 'text-xs font-black text-[#5E4BF2]'

# Card 2: red -> coral
$content = $content -replace [regex]::Escape('border-[#fb0001] bg-white/95 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(251,0,1,0.2)]'), 'border-[#FF8C67]/50 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(255,140,103,0.15)]'
$content = $content -replace [regex]::Escape('bg-[#fb0001] text-white shadow-md'), 'bg-[#FF8C67] text-white shadow-md'
$content = $content -replace [regex]::Escape('bg-[#fdf0f4] border border-[#fb0001]/30 px-3 py-1 text-xs font-black text-[#fb0001]'), 'bg-[#FFF0E8] border border-[#FF8C67]/40 px-3 py-1 text-xs font-black text-[#c05a30]'
$content = $content -replace [regex]::Escape('mt-6 rounded-2xl border-2 border-[#fb0001]/20 bg-[#fdf0f4]'), 'mt-6 rounded-2xl border-2 border-[#FF8C67]/20 bg-[#FFF4EF]'
$content = $content -replace [regex]::Escape('text-sm font-black text-[#fb0001]'), 'text-sm font-black text-[#FF8C67]'
$content = $content -replace [regex]::Escape('text-xs font-black text-[#fb0001]'), 'text-xs font-black text-[#FF8C67]'

# Card 3: yellow -> lime
$content = $content -replace [regex]::Escape('border-[#ffbc03] bg-white/95 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,188,3,0.25)]'), 'border-[#D8F380]/60 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(216,243,128,0.25)]'
$content = $content -replace [regex]::Escape('bg-[#ffbc03] text-[#0f172a] shadow-md'), 'bg-[#D8F380] text-[#2D3142] shadow-md'
$content = $content -replace [regex]::Escape('bg-[#fff8e5] border border-[#ffbc03]/40 px-3 py-1 text-xs font-black text-[#b88600]'), 'bg-[#F0FAD0] border border-[#D8F380] px-3 py-1 text-xs font-black text-[#3D6B00]'
$content = $content -replace [regex]::Escape('mt-6 rounded-2xl border-2 border-[#ffbc03]/30 bg-[#fff8e5]'), 'mt-6 rounded-2xl border-2 border-[#D8F380]/40 bg-[#F6FCE8]'
$content = $content -replace [regex]::Escape('bg-[#ffbc03] px-2 py-0.5 text-[#0f172a] font-extrabold'), 'bg-[#D8F380] px-2 py-0.5 text-[#2D3142] font-extrabold'
$content = $content -replace [regex]::Escape('text-xs font-black text-[#b88600]'), 'text-xs font-black text-[#3D6B00]'

# Card 4: dark -> navy
$content = $content -replace [regex]::Escape('border-[#0f172a] bg-white/95 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'), 'border-[#2D3142]/30 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
$content = $content -replace [regex]::Escape('bg-[#0f172a] text-white shadow-md'), 'bg-[#2D3142] text-white shadow-md'
$content = $content -replace [regex]::Escape('bg-[#f1f5f9] border border-[#0f172a]/20 px-3 py-1 text-xs font-black text-[#0f172a]'), 'bg-[#F1EFFD] border border-[#2D3142]/20 px-3 py-1 text-xs font-black text-[#2D3142]'
$content = $content -replace [regex]::Escape('mt-6 rounded-2xl border-2 border-[#0f172a]/10 bg-[#f8fafc]'), 'mt-6 rounded-2xl border-2 border-[#2D3142]/10 bg-[#F8F7FF]'
$content = $content -replace [regex]::Escape('bg-[#0f172a] px-2 py-0.5 text-white font-extrabold'), 'bg-[#2D3142] px-2 py-0.5 text-white font-extrabold'
$content = $content -replace [regex]::Escape('text-xs font-black text-[#0f172a]'), 'text-xs font-black text-[#2D3142]'

# All generic old color references
$content = $content -replace [regex]::Escape('text-[#0f172a]'), 'text-[#2D3142]'
$content = $content -replace [regex]::Escape('bg-[#1777fb]'), 'bg-[#5E4BF2]'
$content = $content -replace [regex]::Escape('text-[#1777fb]'), 'text-[#5E4BF2]'
$content = $content -replace [regex]::Escape('border-[#1777fb]'), 'border-[#5E4BF2]'
$content = $content -replace [regex]::Escape('bg-[#fb0001]'), 'bg-[#FF8C67]'
$content = $content -replace [regex]::Escape('text-[#fb0001]'), 'text-[#FF8C67]'
$content = $content -replace [regex]::Escape('bg-[#ffbc03]'), 'bg-[#D8F380]'
$content = $content -replace [regex]::Escape('text-[#ffbc03]'), 'text-[#3D6B00]'
$content = $content -replace [regex]::Escape('text-[#0f172a]'), 'text-[#2D3142]'
$content = $content -replace [regex]::Escape('bg-[#0f172a]'), 'bg-[#2D3142]'
$content = $content -replace [regex]::Escape('border-[#0f172a]'), 'border-[#2D3142]'

# Pricing section
$content = $content -replace [regex]::Escape('bg-[#f1f5f9] border-t-3 border-[#0f172a]/10'), 'bg-[#F8F7FF] border-t-3 border-[#E8E6FF]'

# CTA Banner colors
$content = $content -replace [regex]::Escape('rounded-[3rem] border-4 border-[#2D3142] bg-[#5E4BF2]'), 'rounded-[3rem] bg-[#5E4BF2]'
$content = $content -replace [regex]::Escape('border-4 border-[#D8F380] bg-[#D8F380]'), 'bg-[#D8F380]'
$content = $content -replace [regex]::Escape('border-4 border-[#FFAEC9] bg-[#FFAEC9]'), 'bg-[#FFAEC9]'
$content = $content -replace [regex]::Escape('rounded-full bg-[#D8F380] px-4 py-1.5 text-xs font-black uppercase text-[#2D3142]'), 'rounded-full bg-[#D8F380] px-4 py-1.5 text-xs font-black uppercase text-[#2D3142]'
$content = $content -replace [regex]::Escape('inline-flex items-center rounded-2xl bg-[#D8F380] px-8 py-4 text-lg font-black text-[#2D3142] shadow-xl transition duration-300 hover:scale-105 hover:bg-white'), 'inline-flex items-center rounded-2xl bg-[#D8F380] px-8 py-4 text-lg font-black text-[#2D3142] shadow-xl transition duration-300 hover:scale-105 hover:bg-white'

# Footer
$content = $content -replace [regex]::Escape('border-t-2 border-[#0f172a]/10 bg-white'), 'border-t-2 border-[#E8E6FF] bg-white'

Set-Content 'resources/js/pages/welcome.tsx' $content -Encoding UTF8
Write-Host 'Done!'
