


let budgetController = (function(){
let Expenses = function(id, descript, value){
  this.id = id,
  this.descript = descript,
  this.value = value,
  this.percentage = -1
}

Expenses.prototype.calPercentage = function(totalIncome){
  if(totalIncome > 0){
     this.percentage = Math.round((this.value / totalIncome) * 100);
  }else{
    this.percentage = -1;
  }
}

Expenses.prototype.getPercentage = function(){
  return this.percentage;
}
let Income = function(id, descript, value){
  this.id = id,
  this.descript = descript,
  this.value = value
}

let calculateTotal= function(type){
  let sum = 0;
  
  data.allItems[type].forEach(function(e,i,a){
    sum += e.value;
  });
  data.total[type] = sum;
}

let data = {
  allItems : {
    exp : [],
    inc : []
  },
  total : {
    exp : 0,
    inc : 0
  },
  budget : 0 ,
  percentage : 0
  
  
}

  return {
   addItems : function(type, des, val){
     let ID , newItem;
     //creating ID
     //console.log(data.allItems['exp'].length)
     if(data.allItems[type].length > 0){
      ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      //console.info(data.allItems[type][data.allItems[type].length - 1])
     }else{
       ID = 0;
     }
     
     // creating new items
     if(type === 'exp'){
       newItem = new Expenses(ID, des, val)
     } else if(type === 'inc'){
       newItem = new Income(ID, des, val)
     }
     //adding new items to data structures
     data.allItems[type].push(newItem);
     
     return newItem;
   },
   deleteItems : function(type,id){
     let ids,index;
     
        ids = data.allItems[type].map(function(el){
       return el.id;
     });
     index = ids.indexOf(id);
     
     if(index !== -1){
       data.allItems[type].splice(index,1);
      
     }
   },
   calculateBudget :function(){
     //calculate total
     calculateTotal('inc');
     calculateTotal('exp');
     
     //budget
     data.budget = data.total.inc - data.total.exp;
     
     //percentage 
     if (data.total.inc > 0) {
        data.percentage = Math.floor((data.total.exp / data.total.inc) * 100)
     }else{
       data.percentage = -1;
     }
   },
   calculatePercentage : function(){
     data.allItems.exp.forEach(function(cal){
        cal.calPercentage(data.total.inc);
     })
   },
   getPercentage : function(){
     let allPer = data.allItems.exp.map(function(cal){
       return cal.getPercentage();
     });
    // console.log(allPer)
     return allPer;
   },
   getBudget : function(){
     return {
       budget : data.budget,
       totalInc : data.total.inc,
       totalExp : data.total.exp,
       percentage : data.percentage
     }
   },
   testing:function(){
     console.log(data)
   }
  }
  
})();

let UIController = (function(){
    let idClassName = {
    inputTypes : '.select',
    inputDescription : '.in-txt',
    inputValue : '.input-value-area',
    submitButton : '.button',
    inListContainer : '.in-list-container',
    exListContainer : '.ex-list-container',
    balance : '#balance',
    inAmount : '.in-amount',
    exAmount : '.ex-amount',
    percentage : '.percentage',
    listContainer : '.list-container',
    per : '.per',
    dt : '.dt'
  }
  
  let numFor = function(nbr,type){
    let rs,nu;
   nu = numberFormater(nbr,2);
   if(type === 'inc'){
     rs = '+ ' + nu;
   }else if(type === 'exp'){
     rs = '- ' + nu;
   }
   return rs;
  }
  return{
    getInput : function(){
      return {
        type : document.querySelector(idClassName.inputTypes).value,
        description : document.querySelector(idClassName.inputDescription).value,
        value : parseFloat(document.querySelector(idClassName.inputValue).value)
         
      }
    },
    getIdClass : function(){
      return idClassName;
    },
    addItem :function (obj, type){
      let html,newHtml, element;
      if (type === 'inc') {
        element = idClassName.inListContainer;
        html = '<div class="list-items" id="inc-%id%"><div class="list-txt">%description%</div><div class="list-value"><div class="list__value-txt">%value%</div><div class="close-btn-div"><i class="far fa-times-circle "></i></div></div></div>'
      }else if(type === 'exp'){
        element = idClassName.exListContainer;
        html = '<div class="list-items" id="exp-%id%"><div class="list-txt">%description%</div><div class="list-value"><div class="list__value-txt">%value%</div><div class="per"> %</div><div class="close-btn-div"><i class="far fa-times-circle "></i></div></div></div>'
      }
     newHtml = html.replace('%id%',obj.id);
     newHtml = newHtml.replace('%description%',obj.descript);
     newHtml = newHtml.replace('%value%',numFor(obj.value, type));
     //console.log(newHtml);
     document.querySelector(element).insertAdjacentHTML('beforeEnd',newHtml);
    
     return newHtml;
    },
    deleteItem : function(selectId){
      let el = document.getElementById(selectId);
      el.parentNode.removeChild(el);
     // console.log(el,selectId)
    },
    
    displayPercentage : function(per){
      let perFld = document.querySelectorAll(idClassName.per);
     
      function nodeListForEach(fld, cb){
        for(let i = 0; i < fld.length ; i++){
          cb(fld[i],i)
        }
      }
      
      nodeListForEach(perFld, function(el , indx){
        el.textContent = per[indx] + ' %';
      })
    },
    displayDate : function (){
      let dat, month, months,year,date, second, minutes, hours,AmPm;
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      setInterval(function(){
        dat = new Date();
        
        second = dat.getSeconds();
        month = months[dat.getMonth()];
        year = dat.getFullYear();
        minutes = dat.getMinutes();
        hours = dat.getHours();
        date = dat.getDate();
        if(hours >= 12){
          hours = hours - 12;
          AmPm = 'PM';
        }else {
          AmPm = 'AM';
        }
        if (hours <= 9) {
          hours = '0' + hours;
        }
        if (minutes <= 9) {
          minutes = '0' + minutes;
        }
        if (second <= 9) {
          second = '0' + second;
        }
        
      document.querySelector('.dt').textContent =hours + ' : ' + minutes+' : ' + second + ' ' + AmPm + ' ' + date+ ' ' + month + ' ' + year;
      },1000)
    },
    clearField :function(){
      let filed,filedArr;
      //Nodelist of description and value
      filed = document.querySelectorAll(idClassName.inputDescription + ',' + idClassName.inputValue);
      //Nodelist to Array conversation
      /* ** THIS IS BY TUTORIAL**
        filedArr = Array.prototype.slice.call(filed);
        filedArr.forEach(function(e,i,a){
          e.value = '';
        });
       */
       //*** THIS IS BY ME :):):)
       filedArr = []
       for(let i = 0; i < filed.length; i++){
         filedArr[i] = filed[i];
         filedArr[i].value = '';
       }
      filedArr[0].focus();
    },
    displayBudget : function(obj){
      document.querySelector(idClassName.balance).textContent = numFor(obj.budget, obj.budget > 0?'inc':'exp') ;
      document.querySelector(idClassName.inAmount).textContent = numFor(obj.totalInc ,'inc');
      document.querySelector(idClassName.exAmount).textContent = numFor(obj.totalExp,'exp');
      if (obj.budget > 0) {
        document.querySelector(idClassName.percentage).textContent = obj.percentage + ' %';
      }else{
        document.querySelector(idClassName.percentage).textContent = '_ _%';
      }
    }
  }
})()

let controller =(function(budgetClr, UIClr){
 
 
  let setEventeListener = function(){
    //class name of html div
     let className = UIClr.getIdClass();
     //event listener for submit button
    document.querySelector(className.submitButton).addEventListener('click',cntrlAddItems);
    //event listenerfor enter key press 
    document.addEventListener('keypress',function(event){
     //console.log(event.which)
   
      if(event.keyCode === 13 || event.which === 13){
         cntrlAddItems()
      }
    });
    
    document.querySelector('.list').addEventListener('click',cntrlDeleteItems);
 }
 
 let updateBudget = function(){
      //calculate input value
   //1. calculate input budget
   budgetClr.calculateBudget();
   //2. return budget
  let budget = budgetClr.getBudget()
   //update total budget
   //3. display budget
   UIClr.displayBudget(budget)
   //console.log(budget)
   
 }
 
 let updatePercentage = function(){
   //calculate percentage
   budgetClr.calculatePercentage();
   
   // red percentage from budget controller
   let per = budgetClr.getPercentage();
   
   //update ui
   //console.log(per)
    UIClr.displayPercentage(per)
  
 }
  let cntrlAddItems = function(){
    let input, newItem;
     //get data from input filed
     //1. get filed input data
     input = UIClr.getInput();//input value of form
    //console.info(input)
    if((input.description !== '')&& !isNaN(input.value) && (input.value > 0))
   //add items to items list
   // 2. add items to budgetController
   newItem = budgetClr.addItems(input.type, input.description, input.value);
   //console.log(newItem);
   // 3. add items to UIController
   UIClr.addItem(newItem, input.type)
   UIClr.clearField()
  
  //update budget
  updateBudget()
  
  updatePercentage()
 };
 
 let cntrlDeleteItems = function(event){
   let itemsId, splitId , type, ID;
   itemsId = event.target.parentNode.parentNode.parentNode.id
 if (itemsId) {
   splitId = itemsId.split('-');
   type = splitId[0];
   ID = parseInt(splitId[1]);
   
   budgetClr.deleteItems(type,ID)
   
   UIClr.deleteItem(itemsId);
   
   updateBudget();
   
   updatePercentage();
  }
 }
 
 return {
   init:function(){
     UIClr.displayBudget({
       budget : 0,
       totalInc :0,
       totalExp :0,
       percentage :0});
     console.info('app is starting');
     setEventeListener();
     UIClr.displayDate()
   }
 }
 
})(budgetController,UIController);
controller.init();

function numberFormater(num,dcml){
  let splNum, int, dec, intArr,cmAr, newArray,anotherArray,reminder,result;
  //Number convert string with 2 decimal point
  num = num.toFixed(dcml);
  
  //make integer and decimal array
  splitNum = num.split('.');
  
  //integer portion
   int = splitNum[0];
   //decimal portion
   dec = splitNum[1]
  
  //Array of integer Number of every element
  integerArr = int.split('');
  
  //make one array which contain Arrays those contain 3 element
  function pushPopArray(arr){
    //this array contain multiple array
    cmAr = [];
    //loop over the number array
    for(let i = 0; i < arr.length; i++){
      //single array contain 3 element
      let ar = [];
      //picked the number from the numbers array
      for(let j = 0; j < 3; j++){
        ar.unshift(arr.pop())
      }
      cmAr.push(ar)
    }
    return cmAr;
  }
  //
   newArray = pushPopArray(integerArr);
   anotherArray = [];
  //formation of Arrays
  for(let i = 0; i < newArray.length; i++){
   anotherArray.unshift(newArray[i].join(''))
  }
  
  reminder = integerArr.join('');
  if(reminder === ''){
    result = anotherArray.join(',') + '.' + dec;
  }else{
   result = reminder + ','+anotherArray.join(',') + '.'+ dec;
  }
  return result;
}
//console.log(numberFormater(2000.7673,3))