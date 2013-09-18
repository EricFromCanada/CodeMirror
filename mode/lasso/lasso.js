(function() {

  var paramName = /[a-zA-Z_][\w]*/;
  var variableName = /[a-zA-Z_][\w.]*/;

  function tickedString(stream, state) {
    var ch;
    while (ch = stream.next()) {
      if (ch == "`") {
        state.tokenize = null;
        break;
      }
    }
    return "string";
  }

  function words(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }

  CodeMirror.defineMIME("text/x-lasso", {
    name: "clike",
    atoms: words(
      'true false none minimal full all infinity nan and or not ' +
      'bw nbw ew new cn ncn lt lte gt gte eq neq rx nrx ft'),
    builtin: words(
      'array date decimal duration integer map pair string tag xml null ' +
      'list queue set stack staticarray local var variable data global ' +
      'self inherited void'),
    blockKeywords: words(
      'case do else handle handle_failure if inline iterate loop protect ' +
      'provide records require split_thread thread trait type while '),
    keywords: words(
      'error_code error_msg error_pop error_push error_reset cache ' +
      'database_names database_schemanames database_tablenames define_tag ' +
      'define_type email_batch encode_set html_comment handle handle_error ' +
      'header if inline iterate ljax_target link link_currentaction ' +
      'link_currentgroup link_currentrecord link_detail link_firstgroup ' +
      'link_firstrecord link_lastgroup link_lastrecord link_nextgroup ' +
      'link_nextrecord link_prevgroup link_prevrecord log loop ' +
      'namespace_using output_none portal private protect records referer ' +
      'referrer repeating resultset rows search_args search_arguments ' +
      'select sort_args sort_arguments thread_atomic value_list while ' +
      'abort case else if_empty if_false if_null if_true loop_abort ' +
      'loop_continue loop_count params params_up return return_value ' +
      'run_children soap_definetag soap_lastrequest soap_lastresponse ' +
      'tag_name ascending average by define descending do equals ' +
      'frozen group handle_failure import in into join let match max ' +
      'min on order parent protected provide public require returnhome ' +
      'skip split_thread sum take thread to trait type where with ' +
      'yield yieldhome'),
    multiLineStrings: true,
    hooks: {
      "`": function(stream, state) {
        state.tokenize = tickedString;
        return tickedString(stream, state);
      },
      "$": function(stream) {
        stream.match(variableName);
        return "variable-2";
      },
      "#": function(stream) {
        stream.match(variableName);
        stream.match(/\d+/);
        return "variable-2";
      },
      ":": function(stream) {
        if (stream.match(":")) {
          stream.eatSpace();
          stream.match(variableName);
          return "string-2";
        }
        else if (stream.match("=")) return "operator";
      },
      ".": function(stream) {
        if (stream.match("\.\.")) return "attribute";
        else if (stream.match(/\d/)) return "number";
      },
      "-": function(stream) {
        if (stream.match(paramName)) return "attribute";
        else return "operator";
      },
      "\\": function(stream) {
        return "operator";
      },
      "^": function(stream) {
        return null;
      }
    }

  });

})();
