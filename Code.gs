// Setup apps script constants.
const SS = SpreadsheetApp.getActiveSpreadsheet();
const RUBRIC = SS.getActiveSheet();
const RUBRIC_IDX = RUBRIC.getIndex(); // Note that sheet indexes start at 1.
const DESTINATION_IDX = RUBRIC_IDX + 1; // Note, this is not valid until after insertFeedbackSheet() is called.
const ASSESSMENT_NAME = RUBRIC.getName();
const FEEDBACK_FORM = FormApp.create(ASSESSMENT_NAME);
const FEEDBACK_SHEET_NAME = ASSESSMENT_NAME + "_Feedback";
const ROSTER_SHEET_NAME = "Roster"; // Note: This sheet must exist in the SS with this name


// Add Menu item
function onOpen() {
  const menuEntries = [];
  menuEntries.push({name: 'New Feedback Form', functionName: 'generateFeedbackForm'});

  SS.addMenu('WA Tools', menuEntries);
}


function generateFeedbackForm() {
  
  // Generate a complete feedback google form for a particular assessment
  const feedback_sheet = insertFeedbackSheet();
  const student_names = getStudentNames();
  const roster_item = addRosterSelector(student_names);
  const late_item = addLateAssignmentChoice();
  const question_data = readQuestionData();

  for (const question in question_data) {
    addFeedbackItem(`Q${Number(question)+1}`, question_data[question]);
  }

  return 0;
}

function insertFeedbackSheet() {

  // Get the ids of the sheets prior to adding the form destination
  const sheets = SS.getSheets();
  var sheet_ids = new Set();
  for (const sheet of sheets) { sheet_ids.add(sheet.getSheetId()); };
  FEEDBACK_FORM.setDestination(FormApp.DestinationType.SPREADSHEET, SS.getId());

  // Get the ids of the sheets after adding the form destination
  SpreadsheetApp.flush();
  const new_sheets = SS.getSheets();
  var destination_sheet_ids = new Set();
  for (const sheet of new_sheets) { destination_sheet_ids.add(sheet.getSheetId()); };

  // Get sheet ID of destination sheet, set sheet name, and sheet idx
  const destination_sheet_id = Array.from(destination_sheet_ids.difference(sheet_ids))[0];
  const feedback_sheet = SS.getSheetById(destination_sheet_id);
  feedback_sheet.setName(FEEDBACK_SHEET_NAME);
  SS.setActiveSheet(feedback_sheet);
  SS.moveActiveSheet(DESTINATION_IDX);

  // IDs for troubleshooting 
  Logger.log("Feedback form ID: " + FEEDBACK_FORM.getId());
  Logger.log("Assessment Spreadsheet ID: " + SS.getId());
  Logger.log("Destination sheet ID: " + destination_sheet_id);

  return feedback_sheet;

}


// TODO: Figure out a way to have multiple classes in one file
//        Probably need a dialog in the SS to choose the class.
function getStudentNames() {

  // Returns a list of strings containing the student names from the Roster sheet
  const roster_sheet = SS.getSheetByName(ROSTER_SHEET_NAME);
  const class_list = roster_sheet.getRange("A2:A").getValues();
  const numberOfValues = class_list.filter(String).length;
  const student_names = roster_sheet.getRange(2,1,numberOfValues).getValues().flat();

  return student_names;
}


function addRosterSelector(student_names) {

  // Add the roster select item to the form and return the item for chaining.
  const roster_item = FEEDBACK_FORM.addListItem();
  roster_item.setTitle("Please select a student")
    .setRequired(true)
    .setChoiceValues(student_names);

  return roster_item;
}


function addLateAssignmentChoice() {

  // Add the item to check if an assignment is late
  const late_item = FEEDBACK_FORM.addMultipleChoiceItem();
  late_item.setTitle("Is the assignment late?\n\nIf yes, enter date in other field yyyy-mm-dd")
    .setChoices([late_item.createChoice('No')])
    .setRequired(true)
    .showOtherOption(true);

  return late_item;
}


function readQuestionData() {

  // Reads the rubric sheet, and constructs the question dictionary
  // Question Dict. -> {question: 'Question string', rubric: 'Rubric String', possible: val}
  const questionData = RUBRIC.getDataRange().getValues().slice(1);
  var questions = [];
  for (const idx in questionData) { // Either JS is weird, or there is a code smell here... both?
    questions.push({question: `Q${questions.length+1} ${questionData[idx][0]}`,
                    rubric: `Q${questions.length+1} ${questionData[idx][1]}`,
                    possible: `Q${questions.length+1} Points out of ${questionData[idx][2]}`})
  }

  return questions;
}


// TODO: add numeric value validation to the points earned question
function addFeedbackItem(question_number, question_data) {

  // Construct, and insert a complete feedback item
  // 1) Title/Description item -> The question and the rubric for the question
  // 2) Short answer item -> Number of points earned on the question
  // 3) Short answer item -> Feedback to student
  const questionRubric = FEEDBACK_FORM.addSectionHeaderItem()
                         .setTitle(question_data.question)
                         .setHelpText(question_data.rubric);
  const pointsEarned = FEEDBACK_FORM.addTextItem().setTitle(question_data.possible);
  const feedback = FEEDBACK_FORM.addParagraphTextItem().setTitle(`${question_number} Feedback:`);

}


