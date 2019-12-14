//UI controller
var UICtrl = (() => {

    const DOMstrings = {
        active: 'active'
    };

    const DOMelements = {
        addCounterBtn: document.querySelector('#addCounterBtn'),
        addCounterPopup: document.querySelector('#addCounter'),
        addCounterOverlay: document.querySelector('#addCounter .overlay'),
        addBtn: document.querySelector('#addBtn'),
        counterNameInput: document.querySelector('#counterName'),
        mainContainer: document.querySelector('main')
    };

    const counterTemp = '<div id="%id%" class="counter">    <h2>%title%</h2><div class="wrap"><div class="minus-btn"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="2" viewBox="0 0 14 2"><path class="a" d="M19,13H5V11H19Z" transform="translate(-5 -11)" /></svg></div><div class="counter-text"><span>0</span></div><div class="plus-btn"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path class="a" d="M19,13H13v6H11V13H5V11h6V5h2v6h6Z" transform="translate(-5 -5)" /></svg></div></div></div>';

    const plusBubble = '<div class="plus1"><span>+1</span></div>';

    const minusBubble = '<div class="minus1"><span>-1</span></div>';

    return {
        getDOMstrings: () => {
            return DOMstrings;
        },
        getDOMelements: () => {
            return DOMelements;
        },
        getCounterName: () => {
            //return value
            return DOMelements.counterNameInput.value;
        },
        openAddCounterPopup: () => {
            //open popup
            DOMelements.addCounterPopup.classList.add(DOMstrings.active);
            //add focus
            DOMelements.counterNameInput.focus();
        },
        closeAddCounterPopup: () => {
            //close popup
            DOMelements.addCounterPopup.classList.remove(DOMstrings.active);
            //clean value
            DOMelements.counterNameInput.value = '';
            //remove focus
            DOMelements.counterNameInput.blur();
        },
        insertCounterComp: (id, name) => {
            let x = counterTemp;
            x = x.replace('%id%', id);
            x = x.replace('%title%', name)
            return x;
        },
        insertCount: (id, num) => {
            // add count number
            document.querySelector(`#${CSS.escape(id)} span`).innerHTML = num;
        },
        countAnimation: (id, type) => {
            // add plus bubble component
            let bubble;
            switch (type) {
                case 'plus':
                    bubble = plusBubble;
                    bubbleClass = '.plus1';
                    break;
                case 'minus':
                    bubble = minusBubble;
                    bubbleClass = '.minus1';
                    break;
            }

            document.querySelector(`#${CSS.escape(id)}`).insertAdjacentHTML('beforeend', bubble)

            // add plus bubble animation
            const lastBubble =
                document.querySelector(`#${CSS.escape(id)} ${bubbleClass}:last-child`);

            setTimeout(function () {
                lastBubble.classList.add(DOMstrings.active);
            }, 0);
            // remove bubble container
            setTimeout(function () {
                lastBubble.remove();
            }, 1500);
        }

    }

})();


//Data controller
var dataCtrl = (() => {

    var countersData = [];

    var Counter = function (id, name) {
        this.id = id;
        this.name = name;
        this.count = 0;
    };

    let id = 0;

    let cookieData;

    return {
        getNewId: () => {
            return id += 1;
        },
        saveCounterData: (id, name) => {
            let x = new Counter(id, name);
            countersData.push(x);
        },
        addCountData: (counterId, type) => {
            //find array id index
            let index;
            for (var i in countersData) {
                if (countersData[i].id == counterId) {
                    index = i;
                    break;
                }
            }
            switch (type) {
                case 'plus':
                    //return count + 1
                    return countersData[index].count += 1;
                case 'minus':
                    //return count - 1
                    if (countersData[index].count > 0) {

                        return countersData[index].count -=
                            1;
                    } else {
                        return countersData[index].count;
                    }
            }

        },
        data: () => {
            return countersData;
        }
    }
})();


//Master controller
var controller = ((UI, data) => {

    const DOMelem = UI.getDOMelements();

    var setupEventListeners = () => {
        //on add counter click
        DOMelem.addCounterBtn.addEventListener('click', () => {
            //open add counter popup
            UI.openAddCounterPopup();
        });

        //on add counter pop overlay click
        DOMelem.addCounterOverlay.addEventListener('click', () => {
            //close add counter popup
            UI.closeAddCounterPopup();
        });

        //on add button click
        DOMelem.addBtn.addEventListener('click', () => {
            //get input 
            const counterName = UI.getCounterName();

            //create new id
            const counterId = data.getNewId();

            //save all in data structure
            data.saveCounterData(counterId, counterName);


            //close add counter popup
            UI.closeAddCounterPopup();

            //add counter component in ui with the data
            const counterComp = UI.insertCounterComp(counterId, counterName);
            DOMelem.mainContainer.insertAdjacentHTML('afterbegin', counterComp);
        });


        //on main html tag click
        DOMelem.mainContainer.addEventListener('click', event => {
            let parentId;
            let counterNum;
            //on plus btn click
            switch (event.target.className) {
                case 'plus-btn':
                    // get clicked parent id, to know which
                    parentId = event.target.offsetParent.id;

                    // add +1 to the counter data
                    counterNum = data.addCountData(parentId, 'plus');

                    // add +1 to the counter ui
                    UI.insertCount(parentId, counterNum);

                    //add +1 count animation
                    UI.countAnimation(parentId, 'plus');
                    break;
                case 'minus-btn':
                    // get clicked parent id, to know which
                    parentId = event.target.offsetParent.id;

                    // add +1 to the counter data
                    counterNum = data.addCountData(parentId, 'minus');

                    // add -1 to the counter ui
                    UI.insertCount(parentId, counterNum);
                    if (counterNum > 0) {
                        //add -1 count animation
                        UI.countAnimation(parentId, 'minus');
                    }

                    break;
            }
        });
    };

    return {
        init: () => {
            setupEventListeners();
        }
    }
})(UICtrl, dataCtrl);

controller.init();