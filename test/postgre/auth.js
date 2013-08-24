/*
 * @package jsDAV
 * @subpackage DAVACL
 * @copyright Copyright(c) 2013 Mike de Boer. <info AT mikedeboer DOT nl>
 * @author Daniel Laxar
 * @license http://github.com/mikedeboer/jsDAV/blob/master/LICENSE MIT License
 */
"use strict";

var postgre = require('../../lib/shared/backends/postgre.js');
var auth = require('../../lib/DAV/plugins/auth/postgre.js');
var db = require('./db.js');
var authInstance;
var expect = require('chai').expect;
var client;

describe('auth', function () {
	before(function (done) {
		db.init(function (err) {
			if (err)
				return done(err);

			postgre.getConnection(db.c, function (err, cl) {
				if (err) {
					done(err);
				}
				else {
					client = cl;
					authInstance = auth.new(client);

					done();
				}
			});

		});

	});

	it('should get the correct hash for an existing user', function (done) {
		authInstance.getDigestHash('', 'daniel', function (err, hash) {
			if (err)
				return done(err);

			expect(hash).to.be.eq('abc');
			done();
		});
	});

	it('should return undefined for a non existing user', function (done) {
		authInstance.getDigestHash('', 'armin', function (err, hash) {
			if (err)
				return done(err);

			expect(hash).to.be.undefined;
			done();
		});
	})

	after(function (done) {
		client.end();
		db.cleanup(done);
	});
});
