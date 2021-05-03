import pandas as pd
import json
import sys
import xmlparser as xp


def getFiles():
    matchList = json.loads(sys.argv[1])

    inputFile = matchList[-1]

    if not matchList[0] and not matchList[1]:
        print(json.dumps([]))
        return

    xmldir = xp.parsexml(inputFile)

    rawDataFrame = pd.read_csv(xmldir + '_csv.csv')

    filtr = 'Passed' if any(
        'Passed' in match for match in matchList[:-1]) else 'Failed'

    failedScripts = rawDataFrame.loc[rawDataFrame['Outcome'] == filtr]

    for match in matchList[:-1]:
        if match:
            failedScripts = filterData(failedScripts, match)

    scriptName = failedScripts.drop_duplicates(['ScriptName'])

    scriptNameList = scriptName['ScriptName'].tolist()

    print(json.dumps(scriptNameList))
    return


def filterData(dataFrame, match):
    return dataFrame[dataFrame.isin(match).any(axis=1)]


if __name__ == '__main__':
    getFiles()
