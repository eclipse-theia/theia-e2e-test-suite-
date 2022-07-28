// *****************************************************************************
// Copyright (C) 2021 logi.cals GmbH, EclipseSource and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************

import { expect, test } from '@playwright/test';
import { DefaultPreferences, PreferenceIds, TheiaApp, TheiaPreferenceView, TheiaTextEditor, TheiaWorkspace } from '@theia/playwright';

let textEditor: TheiaTextEditor;

test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    const ws = new TheiaWorkspace(['tests/resources/sample-files1']);
    const app = await TheiaApp.loadApp(page, TheiaApp, ws);

    // set auto-save preference to off
    const preferenceView = await app.openPreferences(TheiaPreferenceView);
    await preferenceView.setOptionsPreferenceById(PreferenceIds.Editor.AutoSave, DefaultPreferences.Editor.AutoSave.Off);
    await preferenceView.close();

    textEditor = await app.openEditor('sample.txt', TheiaTextEditor);
});

test.describe('Theia Text Editor', () => {

    test('should be visible and active after opening "sample.txt"', async () => {
        expect(await textEditor.isTabVisible()).toBe(true);
        expect(await textEditor.isDisplayed()).toBe(true);
        expect(await textEditor.isActive()).toBe(true);
    });

    test('should be dirty after changing the file contents and clean after save', async () => {
        await textEditor.replaceLineWithLineNumber('this is just a sample file', 1);
        expect(await textEditor.isDirty()).toBe(true);

        await textEditor.save();
        expect(await textEditor.isDirty()).toBe(false);
        await textEditor.close();

        // FIXME this is expected to fail in order to test the reporting
        expect(true).toBe(false);
    });

});
