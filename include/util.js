function updateExpandState(targetNode, collapserClass, expanded)
{
    if (expanded)
    {
        targetNode.classList.remove(collapserClass);
    }
    else
    {
        targetNode.classList.add(collapserClass);
    }
}

function flipExpandState(element, toggleStateAttrb)
{
    var state = getExpandState(element, toggleStateAttrb);
    element.setAttribute(toggleStateAttrb, state ? "false" : "true");
}

function getExpandState(element, toggleStateAttrb)
{
    var attrbValue = element.getAttribute(toggleStateAttrb);
    if (attrbValue === null || attrbValue === "false")
    {
        return false;
    }
    else if (attrbValue === "true")
    {
        return true;
    }
    else
    {
        return !!attrbValue;
    }
}

function findParentExpandable(element, attrbName)
{
    for (var elem = element.parentElement; elem !== null; elem = elem.parentElement)
    {
        if (elem.getAttribute(attrbName) !== null)
        {
            return elem;
        }
    }

    return null;
}

function setVisibleTabPage(buttonElement, pages, container, formatMapping)
{
    //console.log("Flip");
    //console.log(buttonElement);

    var tabContentClass = formatMapping["tab_content_class"];
    var tabContentKeyAttrb = formatMapping["tab_content_key_attrb"];
    var tabVisibilityClass = formatMapping["tab_visiblity_class"];

    // Clear all
    pages.forEach(function(element)
    {
        element.classList.remove(tabVisibilityClass);
    });

    // Show the one
    var selector = "div." + tabContentClass + "[" + tabContentKeyAttrb + "=\"" + buttonElement.id + "\"]";
    var visibleNode = container.querySelector(selector);
    //console.log("Showing:");
    //console.log(visibleNode);
    visibleNode.classList.add(tabVisibilityClass);
}

function initInteractiveFormatting(formatMapping)
{
    // Use "collapse" CSS class as the modified setting so that no-JS fails to open
    var collapserClass = formatMapping["collapse_class"];
    var toggleAttrbString = formatMapping["toggle_attrb"];
    var toggleStateAttrb = formatMapping["toggle_state_attrb"];
    var expandableElemAttrb = formatMapping["expandable_attrb"];
    var tabContainerAttrbString = formatMapping["tab_container_attrb"];
    var tabSelectorClass = formatMapping["tab_selector_class"];
    var tabContentClass = formatMapping["tab_content_class"];

    var expanderElements = document.querySelectorAll("[" + toggleAttrbString + "]");
    expanderElements.forEach(function(element, index)
    {
        var targetElem = findParentExpandable(element, expandableElemAttrb);
        if (targetElem !== null)
        {
            // Register handler
            element.onclick = function() {
                flipExpandState(targetElem, toggleStateAttrb);
                updateExpandState(targetElem, collapserClass, getExpandState(targetElem, toggleStateAttrb));
                
            }
            // Update current state
            updateExpandState(targetElem, collapserClass, getExpandState(targetElem, toggleStateAttrb));
        }
    });

    var tabElements = document.querySelectorAll("[" + tabContainerAttrbString + "]");
    tabElements.forEach(function(element, index)
    {
        var tabElement = element;
        var buttons = tabElement.querySelectorAll("div." + tabSelectorClass + " > input");
        var pages = tabElement.querySelectorAll("div." + tabContentClass);

        buttons.forEach(function(buttonElement, index)
        {
            buttonElement.onclick = function() {setVisibleTabPage(buttonElement, pages, tabElement, formatMapping);};

            // Handle initial case
            if (!!buttonElement.checked)
            {
                //console.log("Visible: ");
                //console.log(buttonElement);
                setVisibleTabPage(buttonElement, pages, tabElement, formatMapping);
            }
        });
    });


}