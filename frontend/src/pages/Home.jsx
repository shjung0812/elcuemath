import React from 'react';

function Home() {
  return (
    <div className="bg-gray-500 py-10 px-6 rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        🏡 어서 오세요! 홈 페이지입니다~
      </h1>
      <p className="text-gray-700 leading-relaxed mb-6">
        이곳은 홈페이지의 주요 내용을 담고 있는 부분이에요. 편안하게 둘러보시고, 저희가 준비한 이야기를 만나보세요.
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-6">
        <li>좀 더 자세한 정보를 여기에 담을 수 있답니다. 흥미로운 내용으로 채워보세요!</li>
        <li>주요 상품이나 서비스를 보여주는 것도 좋겠죠? 특별한 혜택을 강조해 보세요.</li>
        <li>웹사이트에 대한 간략한 소개를 넣어보세요. 저희가 어떤 곳인지 알려주세요.</li>
      </ul>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => alert('홈 버튼을 클릭하셨네요! 😊')}
      >
        여기 눌러보세요!
      </button>
    </div>
  );
}

export default Home;