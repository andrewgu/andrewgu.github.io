function updateExpandState(targetNode, expanderClass, expanded)
{
    if (expanded)
    {
        targetNode.classList.add(expanderClass);
    }
    else
    {
        targetNode.classList.remove(expanderClass);
    }
}

function initInteractiveFormatting(formatMapping)
{
    var expanderClass = formatMapping["expand_css_class"];
    var expanderAttrbString = formatMapping["expander_attrb"];

    var expanderElements = document.querySelectorAll("input [" + expanderAttrbString + "] [type=checkbox]");
    expanderElements.forEach(function(element, index)
    {
        var targetElemId = element.getAttribute(expanderAttrbString);
        // Register handler
        element.onclick = function() {
            updateExpandState(document.querySelector("#" + targetElemId), expanderClass, element.checked);
        }
        // Update current state
        updateExpandState(document.querySelector("#" + targetElemId), expanderClass, element.checked);
    });
}