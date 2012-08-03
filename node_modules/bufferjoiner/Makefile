REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha test/*.test.js $(OPT) --reporter $(REPORTER)

test-bail:
	@rm -rf lib-cov
	@jscoverage lib lib-cov
	$(MAKE) test OPT=--bail

test-cov:
	@rm -rf lib-cov
	@jscoverage lib lib-cov
	@BUFFER_JOINER_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@open -g coverage.html

.PHONY: test test-bail test-cov