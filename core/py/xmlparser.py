import xml.etree.ElementTree as ET
import csv
import os
import glob
from zipfile import ZipFile
import codecs
import re


def parseXML(fileName):
    try:
        folder_path = './'+fileName
        allList = []
        testSuite = []
        for filename in glob.glob(os.path.join(folder_path, '*.xml')):
            tree = ET.parse(filename)
            package = tree.find('.//testsuite').get('package')
            timeStamp = tree.find('.//testsuite').get('timestamp')
            for testCase in tree.findall('.//testcase'):
                outcome = ''
                message = ''
                finalCause = ''
                typeOfIssue = ''
                test_case = {}
                skipped = testCase.find('.//skipped')
                scriptName = testCase.get('classname').split('.')[-1]
                testCaseName = testCase.get("name")

                # authorName = testCaseName.split(" By: ")[1]
                authorName = testCase.get('owner')
                errorc = testCase.find('.//error')
                failc = testCase.find('.//failure')
                runTime = testCase.get('time')
                runTime = '' if runTime is None else runTime
                authorName = testCase.get('owner').split(' ', 1)[0]

                # no error tag AND no faile tag AND has skipped tag
                if errorc == None and failc == None and skipped != None:
                    outcome = 'Skipped'
                    typeOfIssue = 'Skipped'
                    message = ''

                # has error OR failed tag
                if errorc != None or failc != None:
                    outcome = 'Failed'
                if errorc == None and failc == None and skipped == None:
                    outcome = 'Passed'

                # has error tag AND outcome is Failed then finalcause = script error
                if errorc != None and outcome == 'Failed':
                    finalCause = 'Script Error'
                    message = errorc.get('message')
                    typeOfIssue = 'Script Error'

                # has failed tag AND outcome = failed then finalcause = Test FAilre
                if failc != None and outcome == 'Failed':
                    typeOfIssue = 'Test Failure'
                    message = failc.get('message')

                test_case['ScriptName'] = scriptName
                test_case['LatestUpdate'] = authorName
                test_case['TypeOfIssue'] = typeOfIssue
                test_case['Message'] = message
                test_case['Package'] = package
                test_case['TestCaseTitle'] = testCaseName
                test_case['Author'] = authorName
                test_case['RunTime'] = runTime
                test_case['Time'] = timeStamp
                test_case["Outcome"] = outcome
                testSuite.append(test_case)
            allList.append(testSuite)
        return allList
    except FileNotFoundError:
        print('File does not exist')


def writeCSV(testSuites, filename1):

    # specifying the fields for csv file
    filename1_fields = ['ScriptName', 'TestCaseTitle', 'Author', 'Outcome', 'LatestUpdate',
                        'Package', 'TypeOfIssue', 'Message', 'RunTime', 'Time']
    with open(filename1, 'w', encoding='utf-8', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=filename1_fields)
        writer.writeheader()
        writer.writerows(testSuites)


def extractXml(inputFile):

    last_line_offset = 180
    inputdir = inputFile.rsplit('/', 1)[0]
    a_file = codecs.open('./' + inputFile, encoding='iso-8859-1')
    lines = a_file.readlines()
    last_lines = lines[-last_line_offset:]
    match = re.compile(r'(?<=runId=)(.*)(?=&)')
    runId = re.search(pattern=match, string=[
                      i for i in last_lines if re.search(match, i)][0]).group()
    xmldir = './' + inputdir + '/' + runId + '_' + \
        inputFile.rsplit('/', 1)[1].split('.')[0]

    if not os.path.exists(xmldir):
        zf = ZipFile('./' + inputdir + '/TestResults_' + runId + '.zip', 'r')
        zf.extractall(xmldir)
        zf.close()
    return xmldir


def parsexml(fileName):
    xmldir = extractXml(fileName)
    if not os.path.exists(xmldir + '_csv.csv'):
        testSiutes = parseXML(xmldir)
        writeCSV(testSiutes[0], xmldir + '_csv.csv')
    return xmldir


if __name__ == '__main__':
    parsexml(fileName)
