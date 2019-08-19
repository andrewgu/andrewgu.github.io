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

function initInteractiveFormatting(formatMapping)
{
    // Use "collapse" CSS class as the modified setting so that no-JS fails to open
    var collapserClass = formatMapping["collapse_class"];
    var toggleAttrbString = formatMapping["toggle_attrb"];
    var toggleStateAttrb = formatMapping["toggle_state_attrb"];
    var expandableElemAttrb = formatMapping["expandable_attrb"];

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
}