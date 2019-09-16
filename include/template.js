var WHITESPACE_REGEX = /^\s+/;
var TEMPLATE_REGEX = /\%\{(?<trigger>.*?)\}\%\((?<target>[\w\-]+?)\)/;

var SPACE_CHAR = "&nbsp;";
var TAB_WIDTH = 4;
var TAB_STRING = SPACE_CHAR.repeat(TAB_WIDTH);

function processTemplateNode(node)
{
    var text = node.innerText;
    var lines = text.split(/(\r)?\n/g);

    var parent = node.parentNode;
    parent.removeChild(node);

    // What we're going to do is manually format each line to remove the explicit need for "pre" tags.
    for (var i = 0; i < lines.length; i++)
    {
        var line = lines[i];

        if (!line)
        {
            // Happens for split matches, spliced into array
            continue;
        }
        
        // Process the indent
        var indent = "";
        var indentMatch = line.match(WHITESPACE_REGEX);
        if (indentMatch !== null)
        {
            indent = indentMatch[0].replace(/\t/g, TAB_STRING).replace(/\s/g, SPACE_CHAR);
            line = line.substring(indentMatch[0].length);
        }

        // process the rest of the line
        var innerHtml = indent;
        var targetIds = [];
        while (line.length > 0)
        {
            var templateMatch = line.match(TEMPLATE_REGEX);
            if (templateMatch !== null)
            {
                var before = line.substring(0, templateMatch.index);
                var wrapped = templateMatch.groups["trigger"];
                var target = templateMatch.groups["target"];

                innerHtml += before;
                innerHtml += '<span clickdetail="' + target + '">' + wrapped + '</span>';
                targetIds.push(target);
                
                // Rest of the line
                line = line.substring(templateMatch.index + templateMatch[0].length);
            }
            else
            {
                innerHtml += line;
                break;
            }
        }

        var lineNode = document.createElement("div");
        lineNode.classList.add("codeline");
        lineNode.innerHTML = innerHtml;
        parent.appendChild(lineNode);

        // Move expansion sections to after the code line
        for (var j = 0; j < targetIds.length; j++)
        {
            var targetElem = document.querySelector("#" + targetIds[j]);
            if (!!targetElem)
            {
                parent.appendChild(document.querySelector("#" + targetIds[j]));
            }
        }
    }
}

function convertCodeTemplates()
{
    document.querySelectorAll("pre[templated]").forEach( e =>
        processTemplateNode(e)
    );
}