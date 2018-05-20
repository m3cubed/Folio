import React, { Component } from "react";
import { Button, Input, Popover } from "antd";
import { store } from "./base";
import CourseSelector from "./LessonPlan/Model & Modules/CourseSelector";
import "./Testpage.css";
import CheckList from "./LessonPlan/Model & Modules/CheckList";
import QuillEditor from "./LessonPlan/Model & Modules/Quill";

class Testpage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.curriculumInput = this.curriculumInput.bind(this);
  }

  componentDidMount() {
    store.syncDoc(`/Curriculum/Ontario/High School/Choices`, {
      context: this,
      state: "syncstate",
      then(data) {},
    });
  }

  //Curriculum Input Function
  curriculumInput = () => {
    const pathUnit = `/Curriculum/Ontario/High School/${
      this.state.inputGrade
    }/${this.state.inputSubject}/${this.state.inputCourse}/${
      this.state.inputUnit
    }`;
    store
      .addToCollection(
        pathUnit,
        { key: this.state.inputKey, description: this.state.inputDescription },
        `${this.state.inputType}`,
      )
      .then(data => {
        let fromChoices = this.state.syncstate;
        if (fromChoices.hasOwnProperty(this.state.inputGrade)) {
          //if grade already exists
          var listSubjects = fromChoices[this.state.inputGrade];
          if (
            fromChoices[this.state.inputGrade].hasOwnProperty(
              this.state.inputSubject,
            )
          ) {
            //if subject already exists
            var listCourses =
              fromChoices[this.state.inputGrade][this.state.inputSubject];
            if (
              fromChoices[this.state.inputGrade][
                this.state.inputSubject
              ].hasOwnProperty(this.state.inputCourse)
            ) {
              //if course already exists
              var listUnits =
                fromChoices[this.state.inputGrade][this.state.inputSubject][
                  this.state.inputCourse
                ];
              listUnits = listUnits.filter(
                list => list !== this.state.inputUnit,
              );
              listUnits.push(this.state.inputUnit);
              listUnits.sort();
              console.log(listUnits);
              Object.defineProperty(fromChoices, this.state.inputGrade, {
                value: {
                  [this.state.inputSubject]: {
                    [this.state.inputCourse]: listUnits,
                  },
                },
                writable: true,
                configurable: true,
                enumerable: true,
              });
            } else {
              //if course doesn't exist
              Object.defineProperty(listCourses, this.state.inputCourse, {
                value: [this.state.inputUnit],
                writable: true,
                configurable: true,
                enumerable: true,
              });
            }
          } else {
            //if subject doesn't exist
            Object.defineProperty(listSubjects, this.state.inputSubject, {
              value: { [this.state.inputCourse]: [this.state.inputUnit] },
              writable: true,
              configurable: true,
              enumerable: true,
            });
          }
        } else {
          //if grade doesn't exist
          Object.defineProperty(fromChoices, this.state.inputGrade, {
            value: {
              [this.state.inputSubject]: {
                [this.state.inputCourse]: [this.state.inputUnit],
              },
            },
            writable: true,
            configurable: true,
            enumerable: true,
          });
        }
        this.setState({
          syncstate: fromChoices,
        });
        console.log(this.state.syncstate);
      })
      .catch(err => console.log(err));
  };

  render() {
    let stringtest = { string: "string" };
    let array = { arrary: [1, 2, 3, 4] };
    let object = { 1: "1", 2: "2" };
    var codestring = (
      <div>
        <h1>TEST</h1>
      </div>
    );

    let code = {
      code: codestring,
    };

    const path = `/Curriculum/Ontario/High School/${this.state.inputGrade}/${
      this.state.inputSubject
    }/${this.state.inputCourse}/${this.state.inputUnit}`;

    return (
      <div>
        <h1>Testing Page</h1>
        <QuillEditor />
        <hr />
        {/*TEST button*/}
        <Button onClick={() => {}}>For Tests</Button>
        <hr />
        <div>
          <CheckList />
        </div>
        <button
          onClick={() =>
            store
              .get(
                "/Curriculum/Ontario/High School/Grade 9/Science/SNC1D - Academic Science/A - Scientific Investigation Skills and Career Exploration/Overall Expectations",
                {
                  context: this,
                },
              )
              .then(data => console.log(data.key))
          }
        >
          firestore
        </button>
        <hr />
        <div className="input-fields">
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Input Grade"
              onChange={e => this.setState({ inputGrade: e.target.value })}
            />
            <select
              onChange={e => {
                this.setState({ inputGrade: e.target.value });
              }}
            >
              <option />
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Input Subject"
              onChange={e => this.setState({ inputSubject: e.target.value })}
            />
            <select
              onChange={e => {
                this.setState({ inputSubject: e.target.value });
              }}
            >
              <option />
              <option>Science</option>
              <option>Math</option>
              <option>Geography</option>
              <option>English</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Input Course"
              onChange={e => this.setState({ inputCourse: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Input Unit"
              onChange={e => {
                let unit = e.target.value;
                unit = unit.toLowerCase();
                unit = unit.replace(/\b\w/g, l => l.toUpperCase());
                unit = unit.replace(/\W\s/, " - ");
                console.log(e.target.value);
                console.log(unit);
                this.setState({ inputUnit: unit });
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Input Type"
              onChange={e => this.setState({ inputType: e.target.value })}
            />
            <select
              onChange={e => {
                this.setState({ inputType: e.target.value });
              }}
            >
              <option />
              <option>Overall Expectations</option>
              <option>Specific Expectations</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Input Key List"
              onChange={e => {
                let key = e.target.value.split("||||");
                this.setState({ inputKey: key });
                console.log(key);
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Input Description List"
              onChange={e => {
                let description = e.target.value.split("||||");
                this.setState({ inputDescription: description });
                console.log(description);
              }}
            />
          </div>
          <Popover content={path} title="Path is...">
            <Button type="primary" onClick={this.curriculumInput}>
              Submit to Firestore
            </Button>
          </Popover>
        </div>
        <hr />
        <div>
          <textarea
            onChange={e => {
              let value = e.target.value.replace(
                /\bBy the end of this course, students will:\n*/,
                "\n",
              );
              value = value.replace(
                /\bPerforming and Recording \[PR\]\**/,
                "\n",
              );
              value = value.replace(
                /\bAnalysing and Interpreting \[AI\]\**/,
                "\n",
              );
              value = value.replace(/\bCommunicating \[C\]\**/, "\n");
              value = value.replace(
                /\bThroughout this course, students will\:*/,
                "\n",
              );
              if (this.state.inputType === "Specific Expectations") {
                console.log("specific");
                let newValue = value.replace(/\S*\.\t[\s\S]*?\n/, "");
                while (newValue !== value) {
                  value = newValue;
                  newValue = newValue.replace(/\S*\.\t[\s\S]*?\n/, "\n");
                  newValue = newValue.replace(
                    /\bSample issue\:[\s\S]*?\n/,
                    "\n",
                  );
                  newValue = newValue.replace(
                    /\bSample questions\:[\s\S]*?\n/,
                    "\n",
                  );
                  newValue = newValue.replace(
                    /\bSample problem\:[\s\S]*?\n/,
                    "\n",
                  );
                  newValue = newValue.replace(
                    /\bBy the end of this course, students will:\n*/,
                    "\n",
                  );
                }
                value = newValue;
              }

              value = value.split(/\s{2,}|\n\n|\t/);
              let key = [];
              let description = [];
              for (let i = 0; i < value.length; i++) {
                if (i % 2 === 0) {
                  key.push(value[i]);
                } else {
                  description.push(value[i]);
                }
              }
              console.log(key);
              console.log(description);
              this.setState({
                inputKey: key,
                inputDescription: description,
              });
            }}
            style={{ height: 300, width: 500 }}
          />
          <textarea
            disabled
            value={this.state.value}
            style={{ height: 300, width: 500 }}
          />
        </div>
      </div>
    );
  }
}

export default Testpage;
