export const removeAllEleByParentId = (parentid) => {
    var parent = document.getElementById(parentid);
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}