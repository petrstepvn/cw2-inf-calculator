const DOMInputID = ['attribute', 'gradeEq', 'gradeStone', 'level', 'level-slider', 'empower'];
const DOMResultID = ['result-level', 'result-gradeEq', 'result-gradeStone', 'result-empower', 'result-final'];

const DOMInputElements = DOMInputID.map((id) => document.getElementById(id));
const DOMResultElements = DOMResultID.map((id) => document.getElementById(id));

const inputData = {
	attribute: '',
	gradeEq: '',
	gradeStone: '',
	level: 20,
	empower: true,
};

const result = {
	level: 0,
	gradeEq: 0,
	gradeStone: 0,
	empower: 0,
	final: 0,
};

let data;
const fetchData = async () => {
	const response = await fetch('./data.json');
	const json = await response.json();
	data = await json;
};

DOMInputElements.forEach((element) =>
	element.addEventListener('input', (e) => {
		update(e);
	})
);

const update = (e) => {
	getInputValues(e);
	calculateResult();
	setResultToDOM();
}

document.getElementById('form').addEventListener('submit', (e) => {
	e.preventDefault();
});

const main = async () => {
	await fetchData();
	fillDropdowns();
	update();
};
main();

const fillDropdowns = () => {
	const [attributeDOM, gradeEqDOM, gradeStoneDOM] = DOMInputElements;
	const { Grades, Infected } = data;
	const infectedAttributes = Object.keys(Infected);
	const fill = (options, element) => {
		options.forEach((option) => {
			const optionDOM = document.createElement('option');
			const optionText = document.createTextNode(option);
			optionDOM.value = option;
			optionDOM.appendChild(optionText);
			element.appendChild(optionDOM);
		});
	};
	fill(infectedAttributes, attributeDOM);
	fill(Grades, gradeEqDOM);
	fill(Grades, gradeStoneDOM);

	gradeEqDOM.selectedIndex = Grades.length - 1;
	gradeStoneDOM.selectedIndex = Grades.length - 1;
};

const getInputValues = (e) => {
	const [attributeDOM, gradeEqDOM, gradeStoneDOM, levelDOM, levelSliderDOM, empowerDOM] = DOMInputElements;
	if (e?.target.id === 'level') {
		inputData.level = parseInt(levelDOM.value);
	} else if (e?.target.id === 'level-slider') {
		inputData.level = parseInt(levelSliderDOM.value);
	}
	inputData.attribute = attributeDOM.value;
	inputData.gradeEq = gradeEqDOM.value;
	inputData.gradeStone = gradeStoneDOM.value;
	inputData.empower = empowerDOM.checked;
};

const calculateResult = () => {
	const { attribute, gradeEq, gradeStone, level, empower } = inputData;
	const { Grades, Infected } = data;	
	result.level = Infected[attribute].base[level];
	result.gradeEq = Infected[attribute].multEq * Grades.indexOf(gradeEq);
	result.gradeStone = Infected[attribute].multStone * Grades.indexOf(gradeStone);
	result.empower = empower ? Infected[attribute].multEq * 15 : 0;
	result.final = result.level +	result.gradeEq + result.gradeStone + result.empower;
};

const setResultToDOM = () => {
	const [level, gradeEq, gradeStone, empower, final] = DOMResultElements;
	const [,,, levelDOM, levelSliderDOM] = DOMInputElements;

	level.textContent = result.level;
	gradeEq.textContent = result.gradeEq;
	gradeStone.textContent = result.gradeStone;
	empower.textContent = result.empower;
	final.textContent = result.final;

	levelDOM.value = inputData.level.toString();
	levelSliderDOM.value = inputData.level.toString();
};

