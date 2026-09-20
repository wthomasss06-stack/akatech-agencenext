from pathlib import Path
p=Path('/home/ubuntu/akatech-work/lib/language.js')
s=p.read_text()
s=s.replace("explorerTitle: 'NOS PROJETS',", "explorerTitle: 'NOS PROJETS', viewSite: 'Voir le site',")
s=s.replace("explorerTitle: 'OUR PROJECTS',", "explorerTitle: 'OUR PROJECTS', viewSite: 'View website',")
s=s.replace("explorerTitle: 'NUESTROS PROYECTOS',", "explorerTitle: 'NUESTROS PROYECTOS', viewSite: 'Ver el sitio',")
p.write_text(s)
