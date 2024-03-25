sequenceDiagram
participant browser
participant server

    Note right of browser: The browser displays the new note, then sends the new note to the server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Request has been successfully fulfilled confirmation
    deactivate server

    Note right of browser: The server recieves the note from the browser and adds it to an array, so in case the page gets reloaded the new note is still there
