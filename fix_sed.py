with open('src/components/InfoPage.tsx', 'r') as f:
    c = f.read()
c = c.replace(r'$\$50,000$', r'\$50,000')
c = c.replace(r'$\$200,000$', r'\$200,000')
with open('src/components/InfoPage.tsx', 'w') as f:
    f.write(c)
