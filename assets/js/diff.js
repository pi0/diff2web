function diff(lineDiff) {
			
            // Parse the diff to json
            var diffJson = Diff2Html.getJsonFromDiff(lineDiff);

            // Collect all the file extensions in the json
            var allFileLanguages = diffJson.map(function(line) {
                return line.language;
            });

            // Remove duplicated languages
            var distinctLanguages = allFileLanguages.filter(function(v, i) {
                return allFileLanguages.indexOf(v) == i;
            });

            // Pass the languages to the highlightjs plugin
            hljs.configure({languages: distinctLanguages});

            // Generate and inject the diff HTML into the desired place
            $("#line-by-line-content").html(Diff2Html.getPrettyHtml(diffJson, { inputFormat: 'json', showFiles: true }));
            $("#side-by-side-content").html(Diff2Html.getPrettyHtml(diffJson, { inputFormat: 'json', showFiles: true ,outputFormat: 'side-by-side' }));

            // collect all the code lines and execute the highlight on them
            var codeLines = document.getElementsByClassName("d2h-code-line-ctn");
            [].forEach.call(codeLines, function(line) {
                hljs.highlightBlock(line);
            });
}

var opts = {
		dragClass: "drag",
		readAsDefault: "Text",
		on: {
			beforestart: function() {
				$('.loading').show();
			},
			loadend: function(e, file) {
				var name = file.name;
				var lastModified = file.lastModified;
				var result = e.target.result;
				$("#file-input-form").get(0).reset();
				diff(result);
				$('.loading').hide();
				$('.disabledTab').removeClass('disabledTab');
				$('a[href=#side-by-side]').click();
			}
		}
};
	
$("#file-input, .container").fileReaderJS(opts);
$("body").fileClipboard(opts);