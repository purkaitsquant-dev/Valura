import re

with open('src/components/InfoPage.tsx', 'r') as f:
    content = f.read()

# Isolate the markdown content
parts = content.split('const markdownContent = `')
if len(parts) == 2:
    header = parts[0]
    rest = parts[1]
    
    md_parts = rest.split('`;\n\nexport function InfoPage() {')
    md = md_parts[0]
    footer = '`;\n\nexport function InfoPage() {' + md_parts[1]
    
    # 1. Unescape double backslashes for Math macros since we will use String.raw
    md = md.replace('\\\\', '\\')
    
    # 2. Fix the issues with KaTeX choking on \$ inside math mode
    md = md.replace('$LR < \\$100,000$', '$LR < 100,000$')
    md = md.replace('$LR = \\$33,000$', '$LR = 33,000$')
    md = md.replace('$PV = \\$100,000$', '$PV = 100,000$')
    md = md.replace('$C = \\$10,000\\text{/year}$', '$C = 10,000\\text{/year}$')
    md = md.replace('First income = $50,000 \\times 1.03^{20} = \\$90,305$.', 'First income = $\\text{\\$50,000} \\times 1.03^{20} = \\text{\\$90,305}$.')
    md = md.replace('$FV = 90,305 \\times \\frac{1 - 1.0506^{-30}}{0.0506} \\approx \\$1,386,000$.', '$FV = 90,305 \\times \\frac{1 - 1.0506^{-30}}{0.0506} \\approx 1,386,000$.')
    md = md.replace('$PV = \\$20,000$', '$PV = 20,000$')
    md = md.replace('$C = \\$5,000$', '$C = 5,000$')
    md = md.replace('target = \\$200,000$ (nominal)', 'target = \\$200,000 (nominal)')
    
    # 3. Fix unescaped dollar signs in text that cause math block matching issues
    md = md.replace('Cash: $8,000, Bonds: $25,000', 'Cash: \\$8,000, Bonds: \\$25,000')
    md = md.replace('Long‑horizon equity (goals >10yr) = $200,000 → > $250k?', 'Long‑horizon equity (goals >10yr) = \\$200,000 → > \\$250k?')
    
    # Reassemble with String.raw
    new_content = header + 'const markdownContent = String.raw`' + md + footer
    
    with open('src/components/InfoPage.tsx', 'w') as f:
        f.write(new_content)
    print("Done")
else:
    print("Failed to split")
