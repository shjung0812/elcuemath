export const coloringSingleElement = ({ divListCommonClassName, prefix, specificName, color }) => {
    if (typeof divListCommonClassName === 'undefined') {
      throw new Error('올바른 매개 변수가 제공되지 않았습니다.');
    }
  
    var domeList = document.getElementsByClassName(divListCommonClassName);
  
    for (const element of domeList) {
      element.style.backgroundColor = '';
    }
  
    if (typeof specificName === 'undefined') {
      throw new Error('올바른 매개 변수가 제공되지 않았습니다.');
    }
  
    try {
      document.getElementById(prefix + specificName).style.backgroundColor = color;
    } catch (error) {
        throw new Error(`에러가 발생했습니다 : ${error.message}, 관련변수 prefix : ${prefix}, specificName:${specificName}`);

    //   console.error(`에러가 발생했습니다 : ${error.message}, 관련변수 prefix : ${prefix}, specificName:${specificName}`);
    }
  }
  