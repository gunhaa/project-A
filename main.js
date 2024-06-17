const submit = document.querySelector("#search-btn");
const input = document.querySelector("#search-input");
const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwODcwMTcifQ.IwO241Q_6pqvvGN9SGSmv5RWSu_v9m_ejP9f3QjNTgDASNpdW2BOECwLPph7q_wsKO9DZE49Oyk4U0ufAOCjTdWLpagvffDUGdkniYMNiJW10cBY6dNwHG4fxB1A0HeHWgSeHdh9ZbdtTeDK-CcbL2EDDpYC0H6HTc4vn5u5_7ea7L6QsCVtLbAOD253bys5S8JIZfNLA6yDNudVg50RX9jimB4vamrWreE0v3b0dqPktqdM17AzS33XePvAZTBrqVd4sXZ7yWpSJ77vLeUCT22FhvjKOeuwv7kVFji8vVK6Sl0jywTZnqq-YFa9zWsDdcG3pTdDgt8X2OnA53BcMA";
var inform = "";
const result = document.querySelector("#result");
const weeklyabyss = document.querySelector('#weeklyabyss');
var w_damage;


submit.addEventListener("click", searcharacter);

function searcharacter(event) {
    inform = input.value;
    input.value = "";
    search();
    weeklyAbyss();
    weeklyGuardian();
    detailstats();
    moredetail();
}

input.addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        searcharacter();
    }
})

async function search() {
    // 비동기 통신으로 api와 통신한다, (API URL, 설정)
    const response = await fetch(`https://developer-lostark.game.onstove.com/characters/${inform}/siblings`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    });
    // response.ok의 값이 false라면, throw한다.
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    // JSON 형식의 텍스트를 Javascript 객체로 파싱한다
    const data = await response.json();
    // const stringdata = JSON.stringify(data);
    // result.innerText = stringdata;

    // const searchobj = JSON.parse(data); 이미 javascript 객체라서 파싱을 할 수 없음
    // console.log(data);
    // 비효율적인 방식, 효율 올릴방법 필요함
    data.forEach(function (input) {
        if (inform == input.CharacterName) {
            result.innerHTML = `캐릭터명 : ${input.CharacterName} <br> 서버명 : ${input.ServerName} <br> 직업 : ${input.CharacterClassName} <br> 아이템 레벨 : ${input.ItemMaxLevel
                }`;
        }
    })
}

async function weeklyAbyss() {
    const response = await fetch(`https://developer-lostark.game.onstove.com/gamecontents/challenge-abyss-dungeons`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        }
    })

    if (!response.ok) {
        throw new Error('failed weekly fetch data')
    }

    const data = await response.json();
    // console.log(data)
    weeklyabyss.innerHTML = ` 이번주 던전 :<br> ${data[0].Name}, ${data[1].Name} <img src=${data[0].Image}>`;
}

$('#next').on('click', right);

function right() {

    $('#weeklyContainer').css('transform', 'translateX(-300px');
}


async function weeklyGuardian() {
    const response = await fetch(`https://developer-lostark.game.onstove.com/gamecontents/challenge-guardian-raids`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    })

    if (!response.ok) {
        throw new Error('weeklyGuardian error');
    }

    const data = await response.json();

    // console.log(data);

    $('#weeklyguardian').html(`1. ${data.Raids[0].Name} <br> 2. ${data.Raids[1].Name} <br> 3. ${data.Raids[2].Name} <br> <img src=${data.Raids[0].Image}><br> <img src=${data.Raids[1].Image}><br> <img src=${data.Raids[2].Image}>`)
}

async function detailstats() {
    const response = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${inform}/profiles`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    })

    const data = await response.json();

    // console.log(data);

    $('#result-stats').html(`치명 : ${data.Stats[0].Value} <br> ${data.Stats[0].Tooltip[0]}`);
    $('#result-stats-img').attr('src', `${data.CharacterImage}`)
    $('#result-stats-img').css({
        'width': '200px',
        'height': '200px'
    })
}


async function moredetail() {

    const response = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${inform}/equipment`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    })

    const data = await response.json();
    // 탐색 후 힘/민첩/지능 캐릭터 판별 로직 추가시켜야함
    // console.log(data);
    // const stats = JSON.parse(data[0].Tooltip);
    // w_damage = stats.Element_006.value.Element_001 + stats.Element_008.value.Element_000.contentStr.Element_000.contentStr;

    // 객체 data를 string으로 변환
    let StringData = JSON.stringify(data);

    let sumstats1 = search_stats(StringData);
    let sumstats2 = search_damage(data);
    // let sumstats3 = search_w-damage(StringData);


    // $('#result-stats2').html(`무기 : ${stats.Element_000.value} <br> 무기공격력 : 무기(${stats.Element_006.value.Element_001})<br> 초월 추가 공격력 : ${stats.Element_008.value.Element_000.contentStr.Element_000.contentStr}`)
    $('#result-stats3').html(`총 스탯 : ${sumstats1}`)
    $('#result-stats4').html(`총 추가 공격력 : ${sumstats2}`)
    // $('#result-stats5').html(`총 무기공격력 : ${sumstats3}`)

}

// 리턴 값 스탯
function search_stats(StringData) {
    let str = 0;
    let agi = 0;
    let int = 0;
    // 민첩 +숫자 배열생성
    const regExp1 = /민첩\s*\+(\d+)/g;
    // 힘, 민첩, 지능이 <FONT COLOR='#99ff99'>(숫자) 배열 생성
    const regExp2 = /힘, 민첩, 지능이 <FONT COLOR='#99ff99'>\s*(\d{4})/g;
    // 2자리 숫자만 뽑기
    const regExp3 = /힘, 민첩, 지능이 <FONT COLOR='#99ff99'>\s*(\d{2})/;
    // 초월 숫자 탐색
    const regExp4 = /<img src='emoticon_Transcendence_Grade' width='18' height='18' vspace ='-4'><\/img>(\d{2,3})/;


    // 배열에서 숫자만 다시 뽑기
    const regExpNum = /\d+/g;
    //4자리 숫자만 뽑기
    const regExpNum2 = /\d{4}/g;

    let result1 = StringData.match(regExp1);
    let result1_2 = JSON.stringify(result1);

    let result1_3 = result1_2.match(regExpNum);
    result1_3.forEach((result) => {
        agi += Number(result);
    });

    let result4 = StringData.match(regExp2);
    let result4_2 = JSON.stringify(result4);
    let result4_3 = result4_2.match(regExpNum2);
    result4_3.forEach((result) => {
        agi += Number(result);
    })


    // console.log(result4_3); 4200 , 3개 초월 스탯 검색
    // 55x 별 갯수해야함 result5=55;
    let result5 = StringData.match(regExp3);
    //초월 갯수 찾기
    let result6 = StringData.match(regExp4);
    // console.log(result6[1]); 126
    // console.log(result5[1]*result6[1]); 6930

    agi += Number(result5[1]) * Number(result6[1]);

    // 아바타 보유 유무 체크(영웅 한개당1.01, 전설 한개당 1.02)
    // 임의로 1.08 부여
    agi = (agi + 1365 + 192 + 587) * 1.08;
    return agi;

}

function search_damage(data) {

    let damage = 0;
    // 무기 초월 숫자 찾기
    const regexp1 = /<\/img>(\d{1,3})/;
    // 총 초월 숫자 탐색
    const regexp2 = /<img src='emoticon_Transcendence_Grade' width='18' height='18' vspace ='-4'><\/img>(\d{2,3})/;
    // 엘릭서(공격력)에 따른 추가 공격력(2~4자리수)
    const regexp3 = /<br>공격력\s*\+(\d{2,4})/g;
    // 배열에서 숫자만 다시 뽑기
    const regExpNum = /\d+/g;


    // 무기 초월 갯수에 따른 공격력
    let result1 = JSON.parse(data[0].Tooltip).Element_008.value.Element_000.topStr;
    let w_transcendence = Number(result1.match(regexp1)[1]);

    if (w_transcendence <= 5) {
        damage += 0;
    } else if (w_transcendence <= 10) {
        damage += 640;
    } else if (w_transcendence <= 15) {
        damage += 1795;
    } else if (w_transcendence <= 20) {
        damage += 2755;
    } else {
        damage += 3525;
    }

    //머리 초월 갯수
    let result2 = JSON.parse(data[1].Tooltip).Element_009.value.Element_000.topStr;
    let h_transcendence = Number(result2.match(regexp1)[1]);
    // 총 갯수
    let result3 = JSON.parse(data[1].Tooltip).Element_009.value.Element_000.contentStr.Element_001.contentStr;
    let all_transcendence = Number(result3.match(regexp2)[1]);
    // 머리*총 갯수 공격력 추가
    if (h_transcendence >= 20) {
        damage += 6 * all_transcendence;
    }
    console.log(damage);
    // 엘릭서에 따른 추가 공격력

    let result4 = JSON.stringify(data);
    let result5 = result4.match(regexp3);
    let result6 = JSON.stringify(result5).match(regExpNum);

    if (result6 !== null) {
        result6.forEach((result) => {
            damage += Number(result);
        });
    }
    console.log(damage);


    // console.log(JSON.stringify(data));


    return damage;

}