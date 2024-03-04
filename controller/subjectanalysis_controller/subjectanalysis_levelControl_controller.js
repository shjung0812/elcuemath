export const levelControlFunction=() =>{
    if (activescene == 0) {
        activescene = 1;
        socket.emit('subjectanalysis2', { mode: 'getdata_modechange' });
    } else if (activescene == 1) {
        activescene = 0;
        socket.emit('subjectanalysis2', { mode: 'getdata' });
    } else {
        activescene = 0;
        socket.emit('subjectanalysis2', { mode: 'getdata' });
    }
}

export const changeShow = (cptid, option) => {
    if (option == 'show' || option == 'hide') {
        socket.emit('subjectanalysis2', { mode: 'changeshow', cptid: cptid, option: option })
    } else {
        alert('wrong option');
    }
}