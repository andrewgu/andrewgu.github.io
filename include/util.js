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

function flipExpandState(element, attrbName)
{
    var state = getExpandState(element, attrbName);
    element.setAttribute(attrbName, state ? "false" : "true");
}

function getExpandState(element, attrbName)
{
    var attrbValue = element.getAttribute(attrbName);
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

function initInteractiveFormatting(formatMapping)
{
    // Use "collapse" CSS class as the modified setting so that no-JS fails to open
    var collapserClass = formatMapping["collapse_css_class"];
    var expanderAttrbString = formatMapping["expander_attrb"];
    var expandStateAttrb = formatMapping["expand_state_attrb"];

    var expanderElements = document.querySelectorAll("input[" + expanderAttrbString + "]");
    expanderElements.forEach(function(element, index)
    {
        var targetElemId = element.getAttribute(expanderAttrbString);
        // Register handler
        element.onclick = function() {
            flipExpandState(element, expandStateAttrb);
            updateExpandState(document.querySelector("#" + targetElemId), collapserClass, getExpandState(element, expandStateAttrb));
            
        }
        // Update current state
        updateExpandState(document.querySelector("#" + targetElemId), collapserClass, getExpandState(element, expandStateAttrb));
    });
}