# dataMirror
This function for data debug in javascript

Step 1 : download files to your pc .

Step 2 : include files to your page head
```
<link href="./datamirror.css" rel="stylesheet" />
<script src="./datamirror.min.js"></script>

```
Step 3: open script and use it as dm() shortcut.
Example to use it.
```
<script>
  let myObject = {
     name : "Najeeb Alshami",
     age: 22,
     skills : ["Javascript", "CSS", "HTML", "NodeJs" ]
  };
  // dataMirror function called as dm .
  dm(myobject);
</script>
```

after this open page in browser to see output

#### note 
dm() function accepts 2 arguments.
 The first parameter represents a variable, object, or anything else you want to see on the page.
 The second parameter is optional, representing an explanatory text before the output if desired.
