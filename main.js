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
    data.forEach(function(input){
        if(inform==input.CharacterName){
            result.innerHTML = `캐릭터명 : ${input.CharacterName} <br> 서버명 : ${input.ServerName} <br> 직업 : ${input.CharacterClassName} <br> 아이템 레벨 : ${input.ItemMaxLevel
            }`;
        }
    })
}

async function weeklyAbyss(){
    const response = await fetch(`https://developer-lostark.game.onstove.com/gamecontents/challenge-abyss-dungeons`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        }
    })

    if(!response.ok){
        throw new Error('failed weekly fetch data')
    }

    const data = await response.json();
    // console.log(data)
    weeklyabyss.innerHTML = ` 이번주 던전 :<br> ${data[0].Name}, ${data[1].Name} <img src=${data[0].Image}>`;
}

$('#next').on('click', right);

function right(){

    $('#weeklyContainer').css('transform', 'translateX(-300px');
}


async function weeklyGuardian(){
    const response = await fetch(`https://developer-lostark.game.onstove.com/gamecontents/challenge-guardian-raids` , {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }        
    })

    if(!response.ok){
        throw new Error('weeklyGuardian error');
    }

    const data = await response.json();

    // console.log(data);

    $('#weeklyguardian').html(`1. ${data.Raids[0].Name} <br> 2. ${data.Raids[1].Name} <br> 3. ${data.Raids[2].Name} <br> <img src=${data.Raids[0].Image}><br> <img src=${data.Raids[1].Image}><br> <img src=${data.Raids[2].Image}>`)
}

async function detailstats(){
    const response = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${inform}/profiles`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }  
    })

    const data = await response.json();

    // console.log(data);

    $('#result-stats').html(`치명 : ${data.Stats[0].Value} <br> ${data.Stats[0].Tooltip[0]}`);
    $('#result-stats-img').attr('src' , `${data.CharacterImage}`)
    $('#result-stats-img').css({
        'width' : '200px',
        'height' : '200px'
    })
}


async function moredetail(){

    const response = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${inform}/equipment` ,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }  
    })

    const data = await response.json();

    // console.log(data);
    // console.log(data[0].Tooltip)
    console.log(data);
    const stats = JSON.parse(data[0].Tooltip);
    console.log(stats);
    // search_damage(data[0].Tooltip);
    var RegExpNum = /\d+/g;
    w_damage = stats.Element_006.value.Element_001 + stats.Element_008.value.Element_000.contentStr.Element_000.contentStr;
    
    // var shirt = JSON.parse(data[2].Tooltip);
    // console.log(data[2].Tooltip);
    // shirt.forEach(search_agi);
    var resultstats = [];
    resultstats = search_agi(data[2].Tooltip);
    // console.log(w_damage.match(RegExpNum));

    $('#result-stats2').html(`무기 : ${stats.Element_000.value} <br> 무기공격력 : 무기(${stats.Element_006.value.Element_001})<br> 초월 추가 공격력 : ${stats.Element_008.value.Element_000.contentStr.Element_000.contentStr}`)
    $('#result-stats3').html(`상의 민첩 : ${resultstats}`)

}

function search_agi(element){
    const stats = [];
    var pos=1;
    const substrstats = [];
    while(pos>0){
        pos = element.indexOf('민첩 +', pos);
        if(pos==-1){
            break;
        }
        stats.push(pos);
        pos += 1;
    }

    stats.forEach((index)=>{
        var el = element.substr(index+4,5);
        substrstats.push(el);
    })
    // 문자열에서 숫자만을 자르는 것을 다시 구현해야한다.

    return substrstats;
}