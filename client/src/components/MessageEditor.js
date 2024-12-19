import {Button, TextField} from '@mui/material';

export default function MessageEditor({submit, cancel, show}) {
    let className = show ? "slide-down expanded" : "slide-down";
    let text = "";

    const onTextChange = (e) => {
        text = e.target.value;
    }

    const onSubmit = () => {
        submit(text);
    }

    return (
        <div className={className}>
            <TextField onChange={onTextChange} sx={{paddingLeft: ".4em", paddingRight: ".4em"}} multiline fullWidth minRows={1} maxRows={4}/>
            <div style={{display: "inline-block", float: "right", margin: ".4em"}}>
                <Button onClick={cancel} variant="outlined">Cancel</Button>
                <Button onClick={onSubmit} sx={{marginLeft: ".4em"}} variant="contained">Reply</Button>
            </div>
        </div>
        
    );
}