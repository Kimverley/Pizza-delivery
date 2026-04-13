let orderSection = document.getElementById('orderSection')
let trackerSection = document.getElementById('trackerSection')
let progressFill = document.getElementById('progressFill')
let estimatedTime = document.getElementById('estimatedTime')
let currentStatus = document.getElementById('currentStatus')
let updateList = document.getElementById('updateList')
let notification = document.getElementById('notification')
let orderSummary = document.getElementById('orderSummary')


let steps = [
    document.getElementById("step1"),
    document.getElementById("step2"),
    document.getElementById("step3"),
    document.getElementById("step4"),
    document.getElementById("step5"),
    document.getElementById("step6"),

]

let countdownTimer;
let preparationTimer;
let deliveryTimer;
let secondsLeft = 0;
let minutesLeft = 15;
let currentStep = 0;

//to store and define the 5 stages of pizza preparation within properties
let processSteps = [
    {name: "Order Received", duration: 5, progress: 0},
    {name: "Preparing", duration: 5, progress: 20},
    {name: "In the Oven", duration: 5, progress: 40},
    {name: "Quality Check", duration: 5, progress: 60},
    {name: "Out for Delivery", duration: 5, progress: 80},
    {name: "Delivered", duration: 5, progress: 100},

];

function updateOrderSummary(){
    let size =  document.getElementById("pizzaSize").value;
    let crust = document.getElementById("crustType").value;

    let options = document.getElementById("toppings").options;
    let toppings = [];

    for(let i = 0; i < options.length; i++){
        if (options[i].selected == true) {
            toppings.push(options[i].value);
        }
    }
    let basePrice = 0;

    if(size === "Small") basePrice = 8.99;
    if(size === "Medium") basePrice = 12.99;
    if(size === "Large") basePrice = 15.99;
    if(size === "Extra Large") basePrice = 18.99;

    let toppingsPrice = toppings.length * 1.5;
    let Deliveryfee = 2.99;

    let total = basePrice + toppingsPrice + Deliveryfee;

    orderSummary.innerHTML = 
    `
   <div class="summary-tite">Order Summary</div>
   <div class="summary-item">
    <span>${size} ${crust} Crust PIzza</span>
    <span>$${basePrice}</span>
   </div>
   <div class="summary-item">
    <span>Topping (${toppings.length})</span>
    <span>$${toppingsPrice.toFixed(2)}</span>
   </div>
   <div class="summary-item">
    <span>Delivery Fee</span>
    <span>$${Deliveryfee.toFixed(2)}</span>
    </div>
    <div class="summary-total">
      Total: $${total.toFixed(2)}
    </div>
  `;

}

function startDeliveryProcess(){
    //hide order and show tracker
    orderSection.style.display="none";
    trackerSection.style.display = "block";
    //show notif
    showNotification("Your order has been placed!")
    //add initial update
    addUpdate(
        "Order Received",
        "Your order has been received and is being processed.",
    );

    //start countdown timer
    startCountdown();
    //start preparation process
    startPreparation();
}

    
function startCountdown(){
    //add log entry for timer
    addUpdate(
        "Timer Started",
        "Countdown timer started using setInterval() to update every second.",
    );

    //update timer display initially
    updateTimerDisplay();

    //set interval to update every second
    countdownTimer = setInterval(() => {
        //decrease time
        if (secondsLeft === 0){
            if (minutesLeft === 0){
                //time up - should coincide with delivery complete
                clearInterval(countdownTimer);
                return;
            }
            minutesLeft--;
            secondsLeft = 59;
        } else {
            secondsLeft--;
        }
        updateTimerDisplay()
    }, 1000);
}

function updateTimerDisplay(){
    estimatedTime.textContent = `
    ${minutesLeft.toString().padStart(2, "0")}:
    ${secondsLeft.toString().padStart(2, "0")}
    `

}
function startPreparation(){
    //start w first step already active
    updateStepProgress(0);

    //log the settimeout usage for th efirst transition
    addUpdate (
        "Timer Method",
        `Using setTimeout(${processSteps[0].duration * 1000}) to stimulate moving to "${processSteps[1].name}" stage`,
    );

    //set timeout for first step transition
    preparationTimer = setTimeout(
        processNextStep,
        processSteps[0].duration*1000,
    );
}

//function to process next step
function processNextStep(){
    //if all steo are done, stop
    if (currentStep >= processSteps.length-1){
        return;
    }

    //move to next step
    currentStep++;

    //update progress and stat
    updateStepProgress(currentStep);

    //set timeout for next step 
    let currentDuration = processSteps[currentStep].duration;

    if (currentStep < processSteps.length-1)
    {
        addUpdate(
            "Timer Method",
        `Using setTimeout(${currentDuration * 1000}) to stimulate "${processSteps[currentStep].name}" stage`,
    );
    preparationTimer = setTimeout(processNextStep,currentDuration* 1000);
    }   
    
}

function updateStepProgress(stepIndex){
    console.log(processSteps[stepIndex].progress)
    //update the progress bar 
    progressFill.style.width = `${processSteps[stepIndex].progress}%`

    //update stats text
    currentStatus.textContent = processSteps[stepIndex].name;

    //update step markers
    for ( let i=0; i <= stepIndex; i++){
        steps[i].classList.add("active");
        if (i<stepIndex){
            steps[i].classList.add("completed")
        }
    }

    //add update to the list 
    addUpdate(processSteps[stepIndex].name, getStatusMessage(stepIndex));
}

function getStatusMessage(stepIndex){
    const messages =  [
        "We've received your order and it's been sent to the kitchen.",
        "Our chefs are preparing your pizza with fresh ingredients.",
        "Your pizza is now baking in our brick oven at 700°F.",
        "We're checking that your pizza meets our quality standards.",
        "Your pizza is on its way! Our delivery person is in route.",
        "Your pizza has been delivered. Enjoy your meal",
    ];
    return messages[stepIndex]
}

function addUpdate(title, message){
    let now = new Date();
    let timeStr = now.toLocaleTimeString([], {
        hour:"2-digit",
        minute: "2-digit",
    });

    let updateItem = document.createElement("div");
    updateItem.className = "update-item";

    updateItem.innerHTML =`
    <div class="update-time">${timeStr}</div>
    <div class="update-text">
      <strong>${title}</strong><br>
      ${message}
    </div>
    `
    updateList.prepend(updateItem);
}

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show")
    }, 3000)
}


function resetProcess(){
    //clear all timer
    clearInterval(countdownTimer)
    clearTimeout(preparationTimer)

    //reset variable

    minutesLeft=35;
    secondsLeft=0;
    currentStep = 0;

    //reset progress bar and stat
    progressFill.style.width = '0%'
    currentStatus.textContent = "Order Received"

    //rreset step markers
    steps.forEach((step) =>{
        step.classList.add("active")
        step.classList.remove("completed")
    })
    steps[0].classList.add("active");

    //clear updates
    updateList.innerHTML="";

    //hide tracker and show oder form
    trackerSection.style.display="none";
    orderSection.style.display="block";

}