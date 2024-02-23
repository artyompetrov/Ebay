from flask import Flask
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
from nbconvert import HTMLExporter
from traitlets.config import Config
from nbconvert.preprocessors import TagRemovePreprocessor

c = Config()
c.TagRemovePreprocessor.remove_cell_tags = ("remove_cell",)
c.TagRemovePreprocessor.remove_all_outputs_tags = ("remove_output",)
c.TagRemovePreprocessor.remove_input_tags = ("remove_input",)
c.TagRemovePreprocessor.enabled = True
c.HTMLExporter.preprocessors = ["nbconvert.preprocessors.TagRemovePreprocessor"]
ep = ExecutePreprocessor(timeout=-1, kernel_name='python3')
html_exporter = HTMLExporter(config=c)
html_exporter.register_preprocessor(TagRemovePreprocessor(config=c), True)

app = Flask(__name__)


@app.route('/')
def hello():
	with open('Prices.ipynb') as f:
		nb = nbformat.read(f, as_version=4)

	nb['cells'].insert(1, nbformat.v4.new_code_cell("test = '6Е1П'"))

	# execute notebook
	ep.preprocess(nb)

	# export to html
	html_exporter.exclude_input = True

	html_data, resources = html_exporter.from_notebook_node(nb)

	return html_data

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)
