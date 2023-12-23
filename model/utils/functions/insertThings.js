export const tembBoxDisplayInsertMiddleMethod = ({insertElement,parentElement,refElementForNextSibling}) => {
    const nextSibling=refElementForNextSibling.nextElementSibling
    if(nextSibling){
        parentElement.insertBefore(insertElement, nextSibling);
    }else{
        parentElement.appendChild(insertElement);

    }

}
export const tembBoxDisplayInsertMiddleMethodToggleClickClose = ({ insertElement, parentElement, refElementForNextSibling }) => {
    const nextSibling = refElementForNextSibling.nextElementSibling;
  
    // 클릭된 요소에 클래스를 추가/제거하여 토글 동작 구현
    if (refElementForNextSibling.classList.contains('clicked')) {
      // 이미 클릭된 상태라면 삽입된 내용 삭제
      insertElement.remove();
    } else {
      // 클릭되지 않은 상태라면 내용 삽입
      if (nextSibling) {
        parentElement.insertBefore(insertElement, nextSibling);
      } else {
        parentElement.appendChild(insertElement);
      }
    }
  
    // 클릭 상태를 토글
    refElementForNextSibling.classList.toggle('clicked');
  };
  
export const tembBoxDisplayInsertEndMethod = ({insertElement,parentElement}) => {
    parentElement.appendChild(insertElement);
    
}

export const tembBoxDisplayInsertInsideMethod = ()=>{

}