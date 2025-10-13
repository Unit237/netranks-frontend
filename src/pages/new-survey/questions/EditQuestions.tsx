import AddIcon from '@mui/icons-material/AddRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Avatar, Button, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { Toast } from "../../../components/Toast";
import { ContinueButton } from '../NewSurvey';
import { Confirm } from '../../../components/Confirm';
import connection from '../../../util/connection';

export default function EditQuestions({ newSurvey, setNewSurvey, onContinue }) {
    const questions = newSurvey.Questions;
    const setQuestions = Questions => setNewSurvey(oldSurvey => ({ ...oldSurvey, Questions }))

    return (
        <>
            <QuestionsTable
                questions={questions}
                setQuestions={setQuestions}
            />
            <AddNewQuestion
                questions={questions}
                setQuestions={setQuestions}
            />

            <ContinueButton onContinue={onContinue} />
        </>
    );
}

const width = { xs: "100%", sm: 600 };

export function QuestionsTable({ questions, setQuestions, showClearAllQuestionsButton = true }) {

    const [deletingId, setDeletingId] = useState(0);
    const toast = useRef(undefined);
    const confirm = useRef(undefined);

    const handleDelete = (x, i) => {
        if (!questions[i].Id) {
            remove(i);
            return;
        }

        if (deletingId) {
            return;
        }

        confirm.current.show(
            "Delete Question",
            "Are you sure you want to delete this question?",
            async () => {
                setDeletingId(x.Id);
                try {
                    await connection().delete(x.Id, "api/DeleteQuestion");
                    toast.current.show("success", "Successfully deleted the question");
                    remove(i);
                } catch (error) {
                    toast.current.show("error", "Failed to delete question" + "\r\n\r\n" + error?.data);
                } finally {
                    setDeletingId(0);
                }
            }
        );
    }

    const remove = i => {
        const list = [...questions];
        list.splice(i, 1);
        setQuestions?.(list);
    }

    return (
        <List
            sx={{ width }}
            subheader={<ListSubheader>Questions</ListSubheader>}
        >
            {questions.map((x, i) => (
                <ListItem
                    key={x.Id || i}
                    secondaryAction={setQuestions && (
                        <IconButton title="Delete Question" onClick={() => handleDelete(x, i)} edge="end" aria-label="delete">
                            {deletingId == x.Id ? (
                                <CircularProgress color='inherit' size={20} />
                            ) : (
                                <DeleteIcon />
                            )}
                        </IconButton>
                    )}
                >
                    <ListItemAvatar sx={{ alignSelf: "flex-start" }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12, fontWeight: "bold" }}>
                            {i + 1}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={x.Text || x}
                    />
                </ListItem>
            ))}
            {setQuestions && showClearAllQuestionsButton && (
                <Button variant='text' endIcon={<DeleteIcon />} onClick={() => setQuestions([])}>
                    Clear All Questions
                </Button>
            )}
            <Toast ref={toast} />
            <Confirm ref={confirm} />
        </List>
    );
}

const maxQuestions = 10; // TODO: make max questions parametric

export function AddNewQuestion({ surveyId = null, questions, setQuestions }) {

    const toast = useRef(undefined);
    const [newQuestion, setNewQuestion] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        toast.current.hide();

        if (questions.length >= maxQuestions) {
            // TODO: 
            toast.current.show(
                "warning",
                `You can only add up-to ${maxQuestions} questions.<br /><br />You can delete one from above to add a new question.`
            );
            return;
        }

        if (!surveyId) {
            add(newQuestion);
            return;
        }

        try {
            const newQuestionId = await connection(setIsSubmitting).post("api/AddQuestion", {
                SurveyId: surveyId,
                Question: newQuestion
            });
            add({
                Id: newQuestionId,
                Text: newQuestion
            });
            toast.current.show("success", "Successfully added the question.");
        } catch (error) {
            toast.current.show("error", "Failed to add question." + "<br /><br />" + error?.data);
        }
    }

    const add = x => {
        const list = [...questions];
        list.push(x);
        setQuestions(list);

        setNewQuestion("");
    }

    return (
        <>
            <Toast ref={toast} />
            <List sx={{ width }}>
                <ListItem
                    secondaryAction={
                        <IconButton title="Add Question" onClick={handleSubmit} edge="end" aria-label="add">
                            {isSubmitting ? (
                                <CircularProgress color='inherit' size={20} />
                            ) : (
                                <AddIcon />
                            )}
                        </IconButton>
                    }
                >
                    <ListItemAvatar>
                        <Avatar>
                            <QuestionAnswerIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <TextField
                        fullWidth
                        placeholder="Add new question"
                        sx={{ mr: 2 }}
                        value={newQuestion}
                        onChange={e => !isSubmitting && setNewQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // prevent form submission
                                handleSubmit();
                            }
                        }}
                    />
                </ListItem>
            </List>
        </>
    );
}