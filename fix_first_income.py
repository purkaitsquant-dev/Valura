with open('src/components/InfoPage.tsx', 'r') as f:
    c = f.read()

old_str = r'- First income = $\text{\$50,000} \times 1.03^{20} = \text{\$90,305}$.'
new_str = r'- First income = \$50,000 $\times 1.03^{20} =$ \$90,305.'
c = c.replace(old_str, new_str)

with open('src/components/InfoPage.tsx', 'w') as f:
    f.write(c)
