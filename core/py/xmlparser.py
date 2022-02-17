import json
import xml.etree.ElementTree as ET
import csv
import os
import glob
from zipfile import ZipFile
import codecs
import re


def parseXML(fileName, dbVersion):
    try:
        folder_path = fileName
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
                testCaseName = testCase.get("name")

                # authorName = testCaseName.split(" By: ")[1]
                if dbVersion == '35':
                    scriptName = testCase.get("classname")
                    authorName = testCaseName.split(
                        " By: ")[1].split(' ', 1)[0]
                else:
                    scriptName = testCase.get('classname').split('.')[-1]
                    authorName = testCase.get('owner').split(' ', 1)[0]
                errorc = testCase.find('.//error')
                failc = testCase.find('.//failure')
                runTime = testCase.get('time')
                runTime = '' if runTime is None else runTime

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


def writeCSV(testSuites, inputFile):
    input_segments = inputFile.split('/')
    csv_path = './' + input_segments[1] + '/csv/'

    # Check if file already exist
    if not os.path.exists(csv_path):
        os.mkdir(csv_path)

    # specifying the fields for csv file
    csv_fields = ['ScriptName', 'TestCaseTitle', 'Author', 'Outcome', 'LatestUpdate',
                  'Package', 'TypeOfIssue', 'Message', 'RunTime', 'Time']
    with open(csv_path + input_segments[3], 'w', encoding='utf-8', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_fields)
        writer.writeheader()
        writer.writerows(testSuites)


def extractXml(inputFile):

    last_line_offset = 180
    inputdir = inputFile.rsplit('/', 1)[0]
    a_file = codecs.open('./' + inputFile, encoding='iso-8859-1')
    lines = a_file.readlines()
    last_lines = lines[-last_line_offset:]
    match_str = re.compile(r'(?<=runId=)(.*)(?=&)')

    line_num = [i for i, item in enumerate(
        last_lines) if re.search(match_str, item)]
    if len(line_num) == 0:
        return print("ERROR: Run Id not found. Please use the raw logs from Run Tests and Compile Results or copy the Test Run Analysis url and paste it to the very end of  logs text file")

    runId = re.search(match_str, last_lines[line_num[0]]).group().strip()
    xml_file_name = inputFile.rsplit('/', 1)[1].split('.')[0] + '_' + runId

    xmldir = './' + inputdir + '/xml/' + xml_file_name
    if not os.path.exists(xmldir):
        zf_dir = './' + inputdir + '/TestResults_' + runId + '.zip'
        if not os.path.exists(zf_dir):
            runUrl = 'https://tfs.deltek.com/tfs/Deltek/Vantagepoint/_testManagement/runs?_a=runCharts&runId=' + runId
            return print('Error: TestResults_' + runId +
                         '.zip NOT FOUND. Please download the file in this url: ' + runUrl + ' and save to input folder')

        zf = ZipFile(zf_dir, 'r')
        zf.extractall(xmldir)
        zf.close()
    return xml_file_name

# @parameter path to input log file
# @return list [Database version, platform(mobile, web), Type of Tests(UI Smoke, CRUD...)]


def getRunDetails(inputFile):
    testTypeAnon = {'Smoke': 'uiSmoke', 'HP': 'happy',
                    'CRUD': 'crud', 'E2E': 'endtoend', 'CI': 'tests'}

    first_line_offset = 1000
    logs_dir = './' + inputFile

    # Verify input is correct
    if not os.path.exists(logs_dir):
        return print('ERROR: '+logs_dir + ' not found')
    a_file = codecs.open(logs_dir, encoding='iso-8859-1')
    lines = a_file.readlines()
    last_lines = lines[:first_line_offset]
    match_str = re.compile(r'url:')
    dbVersion = ''
    platform = 'web'

    line_num = [i for i, item in enumerate(
        last_lines) if re.search(match_str, item)]
    qregex = '''(?<=')\s*[^']+?\s*(?=')'''
    testType = re.search(qregex, last_lines[line_num[0] + 4]).group().strip()

    # Touch time
    if 'time' in last_lines[line_num[0]]:
        extracted_text = re.search(qregex, last_lines[line_num[0] + 2])
        dbVersion = extracted_text.group().strip()
        return [dbVersion, 'mobile', 'time']

    # Touch CRM
    if 'crm' in last_lines[line_num[0]]:
        extracted_text = re.search(qregex, last_lines[line_num[0] + 2])
        dbVersion = extracted_text.group().strip()
        return [dbVersion, 'mobile', 'crm']

    # Client DB Runs
    if 'deltekfirst' in last_lines[line_num[0]]:
        extracted_text = re.search(qregex, last_lines[line_num[0] + 4])
        dbVersion = extracted_text.group().strip()
        testType = re.search(
            qregex, last_lines[line_num[0] + 5]).group().strip()
        return [dbVersion, platform, testTypeAnon[testType]]

    # Master
    if 'VantagepointDevelopment' in last_lines[line_num[0]]:
        return ['', platform, testTypeAnon[testType]]

    # MR
    extracted_text = re.search(qregex, last_lines[line_num[0] + 3])
    dbVersion = extracted_text.group().strip()
    return [dbVersion, platform, testTypeAnon[testType]]


def parsexml(fileName):
    dbVersion = getRunDetails(fileName)[0]
    inputdir = fileName.rsplit('/', 1)[0]
    xmldir = extractXml(fileName)
    csv_dir = './' + inputdir + '/csv/' + xmldir + '.csv'

    # check if xml file folder already exist
    if not os.path.exists(csv_dir):
        testSuites = parseXML('./input/xml/' + xmldir, dbVersion)
        writeCSV(testSuites[0], csv_dir)
    return csv_dir


if __name__ == '__main__':
    parsexml(fileName)
