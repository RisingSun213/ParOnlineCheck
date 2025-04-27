// 身份证号校验函数
var checkIdCard = function (num) {
    num = num.toUpperCase();

    if (/^67656\d{3}$/.test(num)) {
        return true;
    }

    var cityCode = {11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"};

    if (!cityCode[num.substr(0, 2)]) {
        return false;
    }
    // 身份证号码为15位或18位
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        return false;
    }

    // 校验15位身份证的生日和转换为18位身份证
    var len = num.length;
    if (len == 15) {
        var re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return false;
        }
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        var nTemp = 0;
        num = num.substr(0, 6) + '19' + num.substr(6);
        for (var k = 0; k < 17; k++) {
            nTemp += num.substr(k, 1) * arrInt[k];
        }
        num += arrCh[nTemp % 11];
        return true;
    }

    // 校验18位身份证
    if (len == 18) {
        var re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return false;
        }

        var valnum;
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        var nTemp = 0;
        for (var k = 0; k < 17; k++) {
            nTemp += num.substr(k, 1) * arrInt[k];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum != num.substr(17, 1)) {
            return false;
        }
        return true;
    }
    return false;
};

// 显示结果
function displayResult(message, isError = false) {
    const resultDisplay = document.getElementById('result');
    const errorDisplay = document.getElementById('error');
    
    if (isError) {
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
        resultDisplay.style.display = 'none';
    } else {
        resultDisplay.textContent = message;
        resultDisplay.style.display = 'block';
        errorDisplay.style.display = 'none';
    }
}

// 查询按钮事件监听
document.getElementById('queryBtn').addEventListener('click', async () => {
    const userId = document.getElementById('userId').value;
    const resultDisplay = document.getElementById('result');
    const loader = document.getElementById('loader');
    const errorDisplay = document.getElementById('error');

    if (!userId) {
        displayResult("请输入有效的身份证号码！", true);
        return;
    }

    // 校验身份证号码
    if (!checkIdCard(userId)) {
        displayResult("身份证号码格式不正确！", true);
        return;
    }

    // 显示加载中
    loader.style.display = 'inline-block';
    resultDisplay.style.display = 'none';
    errorDisplay.style.display = 'none';

    // 将 userId 拼接到查询参数中
    // https://randomnumberfunctionapp.azurewebsites.net/api/query_or_update_entity?code=BDY1vge8xaTfhZaJPWnXUZxfb6jK4zVJT8onUoOHvNDGAzFuwRCGww%3D%3D
    const apiUrl = `https://randomnumberfunctionapp.azurewebsites.net/api/query_or_update_entity?id=${encodeURIComponent(userId)}&code=BDY1vge8xaTfhZaJPWnXUZxfb6jK4zVJT8onUoOHvNDGAzFuwRCGww%3D%3D`;

    try {
        // 发起请求
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 解析返回数据
        const data = await response.json();
        console.log(`Get Condition: ${data.Condition}`);

        const status = data.Condition;
        console.log(`status: ${status}`);

        // 显示相应的结果
        switch (status) {
            case "0": // 注意返回可能是字符串
                resultDisplay.innerHTML = "您已参加过本次实验，谢谢！";
                break;
            case "1":
                resultDisplay.innerHTML = `您尚未参加本次实验，请点击以下链接进行参与：<a href="https://www.naodao.com/project/968905764578267138" target="_blank">点击这里参加实验</a>`;
                break;
            case "2":
                resultDisplay.innerHTML = `您尚未参加本次实验，请点击以下链接进行参与：<a href="https://www.naodao.com/project/968905655723495426" target="_blank">点击这里参加实验</a>`;
                break;
            case "3":
                resultDisplay.innerHTML = "抱歉，当前实验轮次已招满，您可以参与后续的实验：";
                break;
            default:
                resultDisplay.innerHTML = "发生未知错误，请稍后再试。";
        }

        // 显示结果
        resultDisplay.style.display = 'block';
    } catch (error) {
        console.error("请求失败：", error);
        displayResult("发生错误，请稍后再试！", true);
    } finally {
        // 隐藏加载指示器
        loader.style.display = 'none';
    }
});



// function displayResult(message, isError = false) {
//     const resultDisplay = document.getElementById('result');
//     resultDisplay.innerHTML = message;
//     if (isError) {
//         resultDisplay.style.color = 'red';
//     } else {
//         resultDisplay.style.color = 'black';
//     }
// }
