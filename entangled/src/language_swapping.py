import pandas as pd

ex_data = pd.read_excel('Entangled_Philosophies_Translations.xlsx')

germanVals = ex_data['German'].values.tolist()
englishVals = ex_data['English'].values.tolist()

caseNum = 1
for i in range(len(germanVals)):
    print('case ' + str(caseNum) + ':')
    print("\tif (lang=='eng') return \"" + englishVals[i] + "\";")
    print("\tif (lang=='ger') return \"" + germanVals[i] + "\";")
    print("\tbreak;")
    caseNum += 1
