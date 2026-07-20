with open('src/components/InfoPage.tsx', 'r') as f:
    c = f.read()
c = c.replace(r'$\ge \$250,000$', r'$\ge 250,000$')
with open('src/components/InfoPage.tsx', 'w') as f:
    f.write(c)
