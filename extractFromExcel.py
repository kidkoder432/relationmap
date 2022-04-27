import openpyxl, pprint, random

log = pprint.pprint

wb = openpyxl.load_workbook('rel 4-26.xlsx', data_only = True)

sheet = wb['Connections']
print(sheet.cell(1, 2).value)


con = {}
random.seed(42)
cols = [x.value for x in list(sheet.rows)[0][1:]]
random.shuffle(cols)
log(cols)
rows = list(sheet.rows)[1:]
random.shuffle(rows)
for row in rows:
    con[row[0].value] = {
        'friends': [],
        'likes': [],
        'enemies': [],
        'acquaintances': []
    }
    currentPerson = con[row[0].value]
    random.seed(42)
    x = list(row[1:])
    random.shuffle(x)
    for i, relation in enumerate(x):
        if not relation.value:
            continue

        if relation.value[0] == 'F':
            currentPerson['friends'].append(cols[i])
        elif relation.value[0] == 'L':
            currentPerson['likes'].append(cols[i])
        elif relation.value[0] == 'E':
            currentPerson['enemies'].append(cols[i])
        elif relation.value[0] == 'A':
            currentPerson['acquaintances'].append(cols[i])

del con[None]
log(con)

import json
json.dump(con, open('relationships.jsonc', 'w'))