# FeedbackUtils

This script is designed to be bound to a spreadsheet with the onOpen trigger set to run the onOpen function.

The script requires that a sheet with the name 'Roster' exists with 1 header row. Additionally, the assessments must be on individual sheets with columns: 'Question', 'Rubric', 'Points Possible'.

The Question column is expected to have the full text of the question.
The Rubric column is expected to have a description of thow the question is to be greaded. This could include a detailed rubric, or simply an answer to the question.
The Points Possible column should simply have a number of points a question may be awared.

The Feedback form will then be generated in the root of your google drive with the same name as the sheet in the spreadsheet. You do not need to publish your form to use it. You can just copy the responder link, and go to that address to begin grading.

Once you are completed with your grading, your scoring and feedback will be saved in a new sheet in the spreadsheet you generated the form from. You can then export this data to CSV, or use it however you like to add to your LMS, or normal student feedback channels.
