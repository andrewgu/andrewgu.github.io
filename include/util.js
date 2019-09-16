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

function setupTooltipInteraction(element, tooltipElement, tooltipClass)
{
    function onMouseEnter(src, tooltip)
    {
        var clientRect = src.getBoundingClientRect();
        var targetX = window.scrollX + clientRect.left;
        var targetY = window.scrollY + clientRect.bottom;
        tooltip.style.left = targetX + "px";
        tooltip.style.top = targetY + "px";
        tooltip.style.opacity = 1.0;
    }

    function onMouseLeave(src, tooltip)
    {
        tooltip.style.left = "0px";
        tooltip.style.top = "0px";
        tooltip.style.opacity = 0.0;
    }

    tooltipElement.classList.add(tooltipClass);
    tooltipElement.style.opacity = 0.0;
    document.body.appendChild(tooltipElement);

    element.addEventListener("mouseenter", function(e){onMouseEnter(element, tooltipElement)});
    element.addEventListener("mouseleave", function(e){onMouseLeave(element, tooltipElement)});
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
    var tooltipAttrbString = formatMapping["tooltip_attrb_string"];
    var tooltipClass = formatMapping["tooltip_class"];
    var clickdetailClass = formatMapping["clickdetail_class"];
    var clickdetailAttrbString = formatMapping["clickdetail_attrb_string"];

    // Expandable sections
    var expanderElements = document.querySelectorAll("[" + toggleAttrbString + "]");
    expanderElements.forEach(function(element, index) {
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

    // Subsections keyed to a specific trigger to expand details.
    var clickdetailExpanders = document.querySelectorAll("[" + clickdetailAttrbString + "]");
    clickdetailExpanders.forEach(function(element, index) {
        var targetElem = document.querySelector("#" + element.getAttribute(clickdetailAttrbString));
        console.log(targetElem);
        if (targetElem !== null)
        {
            // Import the node.
            targetElem.style.display = "none";
            
            element.onclick = function() {
                var alreadyExpanded = element.getAttribute("expanded");
                if (alreadyExpanded && alreadyExpanded == "true")
                {
                    targetElem.style.display = "none";
                    targetElem.style.opacity = 0;
                    element.setAttribute("expanded", "false")
                }
                else
                {
                    targetElem.style.display = "block";
                    element.setAttribute("expanded", "true")
                    window.requestAnimationFrame(function() {
                        targetElem.style.opacity = 1;
                    });
                }
            }
        }
    });

    // Tab sections
    var tabElements = document.querySelectorAll("[" + tabContainerAttrbString + "]");
    tabElements.forEach(function(element, index) {
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

    // Tooltip sections
    var tooltipElements = document.querySelectorAll("[" + tooltipAttrbString + "]");
    tooltipElements.forEach(function(element, index) {
        var targetElemId = element.getAttribute(tooltipAttrbString);
        if (targetElemId !== null)
        {
            var targetElem = document.querySelector("#" + targetElemId);
            if (targetElem !== null)
            {
                console.log(targetElem);
                setupTooltipInteraction(element, targetElem, tooltipClass);
            }
        }
    });
}