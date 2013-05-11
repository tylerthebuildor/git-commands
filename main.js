/** Init GitCommands **/
function init() { GitCommands.init() }

/** GitCommands Namespace **/
var GitCommands = (function() {
	
	/* globals */
	var el = {
	
			list : document.getElementById('list'),
			search : document.getElementById('search'),
			searchi : document.getElementById('search').nextSibling,
			graph : document.getElementById('graph'),
			dropdown: document.getElementById('dropdown')
			
		},
	template = {
		
			li : '<tr id="{id}" class="li">' +
							'<td>{cmd}</td>' +
							'<td>{desc}</td>' +
						'</tr>',
			li_label : '<tr class="label">' +
									'<td>{cmd}</td>' +
									'<td>{desc}</td>' +
								'</tr>',
			trip : '<div class="arrow {config}"></div>'
			
		},
	li = [ 
			{cmd: 'command', 
			desc: 'description',
			config: 'label'},
			{cmd: 'git init',
			desc: 'set up local git repository in current directory',
			config: ['box posC']},
			{cmd: 'git add &lt;file&gt;',
			desc: 'add file to staging area',
			config: ['right small posA']},
			{cmd: 'git commit -m "Message in present tense"',
			desc: 'commit to the changes you\'ve added to stage',
			config: ['right small posB']},
			{cmd: 'git remote add origin &lt;remote&gt;',
			desc: 'add remote repository to push to',
			config: ['left large posA']},				
			{cmd: 'git push',
			desc: 'push commited changes to remote repo")',
			config: ['right small posC']},
			{cmd: 'git pull origin &lt;branch&gt;',
			desc: 'pull branch files and replace with files in working directory',
			config: ['left small posC', 'left medium posA']},
			{cmd: 'git rm &lt;file&gt;',
			desc: 'remove file from working directory and local repo ("git push" after to remove from remote repo)',
			config: ['box posA', 'box posC']},
			{cmd: 'git config credential.helper cache',
			desc: 'cache password for the next 15 minutes',
			config: ['box posC']},
			{cmd: 'git checkout &lt;branch&gt;',
			desc: 'replace current working directory files with &lt;branch&gt; files',
			config: ['left medium posA']},
			{cmd: 'git branch &lt;name&gt;',
			desc: 'creates branch with &lt;name&gt;',
			config: ['box posC']},
			{cmd: 'git checkout -b &lt;name&gt;',
			desc: 'create branch and check it out',
			config: ['box posC', 'left medium posA']},
			{cmd: 'git push origin &lt;branch&gt;',
			desc: 'add local branch to remote repository (add -u for first push)',
			config: ['right large posA']},
			{cmd: 'git reset &lt;file&gt;',
			desc: 'opposite of add',
			config: ['box posB']},
			{cmd: 'git diff &lt;HEAD&gt;',
			desc: 'check difference between files',
			config: ['box posA', 'box posB', 'box posC', 'box posD']},
			{cmd: 'git config &lt;option&gt;',
			desc: 'change options for current repo',
			config: ['box posC']},
			{cmd: 'git branch -d/-D &lt;branch&gt;',
			desc: 'delete local branch only',
			config: ['box posC']},
			{cmd: 'git push origin :&lt;branch&gt;',
			desc: 'delete remote branch',
			config: ['box posD']},
			{cmd: 'git remote prune origin',
			desc: 'remove stale remote references',
			config: ['box posD']},
			{cmd: 'git tag',
			desc: 'tag current version',
			config: ['box posC']},
			{cmd: 'git log --oneline --graph',
			desc: 'graph all commits',
			config: ['box posC']},
			{cmd: 'git blame',
			desc: 'find out whose to blame',
			config: ['box posD']},
			{cmd: 'git subtree push --prefix dist origin :&lt;subtree&gt;',
			desc: 'push subfolder to subtree',
			config: ['box posD']},
			{cmd: 'git commit -a -m "&lt;message&gt;"',
			desc: 'git add . and git commit -m',
			config: ['right small posA', 'right small posB']},
			{cmd: 'git remote -v',
			desc: 'display remotes verbosely',
			config: ['box posC']},
			{cmd: 'git commit -ammend -m "&lt;message&gt;"',
			desc: 'retract last commit',
			config: ['box posC']},
			{cmd: 'git reset --soft HEAD^',
			desc: 'reset last HEAD',
			config: ['box posC']},
			{cmd: 'git remote show origin',
			desc: 'show remote origin',
			config: ['box posC']},
			{cmd: 'git merge &lt;branch&gt;',
			desc: 'merge named branch with currently checked out branch',
			config: ['box posC']},
			{cmd: 'git branch -r',
			desc: 'list remote branches',
			config: ['left small posD']},
			{cmd: 'git push -u <remote> --force',
			desc: 'override all files in remote repo',
			config: ['right small posC']},
			{cmd: 'git config user.name "Billy Everyteen"',
			desc: 'set username for remote push add --global for all repos',
			config: ['right small posC']},
			{cmd: 'git config user.name "Billy Everyteen"',
			desc: 'set username for remote push add --global for all repos',
			config: ['right small posC']},
			{cmd: "git config credential.helper 'cache --timeout=3600'",
			desc: 'cache password for period of time',
			config: ['box posC']}
		],
	listLen = li.length
	
	/* functions */
	var init = function() {
	
			displayli()
			initEvents()
			
		},
	initEvents = function() {
	
			el.search.onkeyup = function(event) { 
				var q = this.value					
				q = q.replace(/</g, '&lt;')
				q = q.replace(/>/g, '&gt;')
				displayli(q) 
				
				var toggle = (q) ? '&#xf057;' : '&#xf002;'
				el.searchi.innerHTML = toggle
				
				el.graph.innerHTML = ''
			}
			
			el.searchi.onclick = function(event) {
				this.innerHTML = '&#xf002;'
				this.previousSibling.value = ''		
				displayli()
			}
			
			el.list.onclick = function(event) {
				var element = event.target.parentElement				
				if (element.getAttribute('class') === 'li') {

					if (document.getElementsByClassName('selected')[0])
						document.getElementsByClassName('selected')[0].className = 'li'
					element.className = 'li selected'
				
					drawConfig( element.getAttribute('id') )
					
				}
			}
			
			el.graph.onclick = function(event) {
				el.graph.style.display = 'none'
				el.dropdown.style.display = 'inherit'
			}
			
			el.dropdown.onclick = function(event) {
				el.graph.style.display = 'inherit'
				el.dropdown.style.display = 'none'
			}
		
		},				
	displayli = function(q) {
			var i = 0, text, output
			el.list.innerHTML = ''
			
			for( ; i<listLen; i++) {
				text = li[i].cmd + ' ' + li[i].desc				
				li[i].id = i
				
				if (li[i].config == 'label') 
					output = template.li_label.supplant(li[i])
				else if (q)
					output = ( text.search(q) > -1 ) ? template.li.supplant(li[i]) : ''
				else
					output = template.li.supplant(li[i])	
					
				el.list.innerHTML += output
			}		
		},
	drawConfig = function(index) {
			var i = 0, len = li[index].config.length
			el.graph.innerHTML = ''
			
			for( ; i<len; i++) {
				el.graph.innerHTML += template.trip.supplant({config : li[index].config[i]})
			}
			
		}
		
	return { init : init }
	
})()

/** Supplant **/
if (!String.prototype.supplant) {
	String.prototype.supplant = function (o) {
		return this.replace(/{([^{}]*)}/g,
			function (a, b) {
				var r = o[b]
				return typeof r === 'string' || typeof r === 'number' ? r : a
			}
		)
	}
}

/* init */
init()