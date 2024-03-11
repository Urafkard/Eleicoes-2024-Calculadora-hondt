const fs = require('fs');

const LOCALS = JSON.parse(fs.readFileSync('./data/locals.json','utf-8'));


let cur_local;

let local_data;


let final_results = {}

function hondt(data) {
	// votes from ADN to PSD
	// remover o comentario a baixo para adicionar os votos do ADN as coligaçãoes do PPD/PSD.CDS-PP
	/*
	let temp_psd = data.resultsParty.findIndex((elem) => elem.acronym == "PPD/PSD.CDS-PP.PPM")
	if(temp_psd == -1) {
		temp_psd = data.resultsParty.findIndex((elem) => elem.acronym == "PPD/PSD.CDS-PP")
	}
	const psd_index = temp_psd;

	const adn_index = data.resultsParty.findIndex((elem) => elem.acronym == "ADN")

	data.resultsParty[psd_index].votes += data.resultsParty[adn_index].votes;

	data.resultsParty[adn_index].votes = 0;	
	*/


	let total_elect = 0;
	// formatação dos dados para serem mais faceis de processar
	list = data.resultsParty.map((elem) => {return {'name': elem.acronym, 'votes': elem.votes, 'cur_votes': elem.votes, 'elect': 0}})
	// Iterar até atribuir todos os mandatos
	while(total_elect < data.totalMandates) {
		// obter o partido com mais votos atualmente (após a divisao do numero de mandatos que já têm)
		const most_votes = list.reduce((acc,cur,curInd,arr) => cur.cur_votes > arr[acc].cur_votes ? curInd : acc,0);
		

		const temp = list[most_votes].cur_votes;

		// Adiciona um novo mandato e atualiza o numero de votos
		list[most_votes].elect++;
		list[most_votes].cur_votes = list[most_votes].votes/(list[most_votes].elect+1);
		
		total_elect++;

		// Se for o ultimo calcular qual foi o partido em segundo para o ultimo mandato
		if(total_elect == data.totalMandates){
			const temp2 = list.reduce((acc,cur,curInd,arr) => cur.cur_votes > arr[acc].cur_votes ? curInd : acc,0);

			console.log(`${list[temp2].name} lost to ${list[most_votes].name} by ${Math.ceil((temp - list[temp2].cur_votes) * (list[temp2].elect+1))} votes (${list[temp2].cur_votes} to ${temp})`)
		}
	}
	console.log();
	let i = 0;

	// faz a impressão dos dados
	while(true) {
		if(list[i].elect == 0) {
			break
		}
		if(!final_results[list[i].name]) {
			final_results[list[i].name] = list[i].elect;	
		}else{
			final_results[list[i].name] += list[i].elect;
		}
		
		console.log(`${list[i].name}	${list[i].elect}`);
		
		i++;
	}

	console.log();
	console.log();
}


function read(i) {
	cur_local = LOCALS[i];
	console.log(cur_local.name);
	console.log();

	local_data = JSON.parse(fs.readFileSync(`./data/${cur_local.territoryKey}.json`,'utf-8'));
	hondt(local_data.currentResults);
	
}

for(let i = 0; i < LOCALS.length; i++){
	read(i);
}

console.log();
for (const [key, value] of Object.entries(final_results)) {
	console.log(`${key}	${value}`);
}

