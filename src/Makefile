# ***** BEGIN LICENSE BLOCK *****
#
# Copyright 2013 Namit Bhalla (oyenamit@gmail.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# The original code is the MacDict Firefox extension.
#
# ***** END LICENSE BLOCK *****


#
# This Makefile uses utilities like cp, rm, zip and uname.
# For full and proper functioning, a unix-y environment is required.
# It could be some flavor of Unix/Linux or Mac or Windows with cygwin/mingw.
#

# The XPI file that is created as part of this build.
xpi_filename := macdict@oyenamit.xpi

# The Firefox profile folder where XPI file will be installed.
profile_foldername := 7qx54u2k.Dev

# Location of build files before they are installed in Firefox profile folder.
# TODO: This needs to be refined. Output folder should be defined by an environment var?
output_folder := ../../macdict-binaries
output_xpi_file := $(output_folder)/$(xpi_filename)

# Determine the Firefox profile folder path
#
# The logic to differentiate between different operating systems is picked up from the git Makefile.
# (http://git.kernel.org/?p=git/git.git;a=blob_plain;f=Makefile;hb=c965c029330b1f81cc107c5d829e7fd79c61d8ea)
#
# Let's not have nested if-else because understanding and maintaining them is difficult.
#
UNAME_S := $(shell sh -c 'uname -s 2>/dev/null || echo not')

profile_path := unknown

# Linux
# "Linux"
ifeq ($(UNAME_S), Linux)
	profile_path := ~/.mozilla/firefox/$(profile_foldername)/extensions/
endif

# Mac
# "Darwin"
ifeq ($(UNAME_S), Darwin)
	profile_path := ~/Library/Application\ Support/Firefox/Profiles/$(profile_foldername)/extensions/
endif

# Windows (Cygwin)
# "CYGWIN_NT-5.1"
ifneq (,$(findstring CYGWIN,$(UNAME_S)))
	profile_path := "$(APPDATA)\\Mozilla\\Firefox\\Profiles\\$(profile_foldername)\\extensions\\"
endif

# Windows (MinGW)
# "MINGW32_NT-5.1"
ifneq (,$(findstring MINGW,$(UNAME_S)))
	profile_path := "$(APPDATA)\\Mozilla\\Firefox\\Profiles\\$(profile_foldername)\\extensions\\"
endif

# Windows (QNX)
# "Microsoft Windows XP Workstation"
ifneq (,$(findstring Windows,$(UNAME_S)))
	profile_path := "$(APPDATA)\\Mozilla\\Firefox\\Profiles\\$(profile_foldername)\\extensions\\"
endif

# Default case if profile_path was not set by any of the conditions earlier.
# Fallback to Windows.
ifeq ($(profile_path), unknown)
	profile_path := "$(APPDATA)\\Mozilla\\Firefox\\Profiles\\$(profile_foldername)\\extensions\\"
endif


# The sources for the XPI file
src_file_list := install.rdf \
				 chrome.manifest \
				 $(wildcard content/*.js) \
				 $(wildcard content/*.xul) \
				 $(wildcard content/*.xml) \
				 $(wildcard content/*.css) \
				 $(wildcard skin/*.css) \
				 $(wildcard skin/*.png) \
				 $(wildcard locale/*/*.dtd) \
				 $(wildcard locale/*/*.properties) \
				 LICENSE.txt \
				 NOTICE.txt  \
				 CREDITS.txt


# This is the default goal.
.PHONY: all
all: $(output_xpi_file)
	@echo "Build finished successfully."
	@echo


# Creates the XPI file
$(output_xpi_file) : $(src_file_list)
	@mkdir -p $(output_folder)
	@echo "Creating XPI file at '$(output_folder)'."
	@zip $(output_xpi_file) $(src_file_list)
	@echo "Done creating XPI file."
	@echo



# Installs the XPI file to the specified Firefox profile folder
.PHONY: install
install:
	@test -s $(output_xpi_file) || { echo "Nothing to install! Maybe you forgot to build first?"; exit 1; }
	@echo "Installing in Firefox profile folder '$(profile_foldername)'."
	@cp -Rf $(output_xpi_file) $(profile_path)$(xpi_filename)
	@echo "Done installing in Firefox profile folder."
	@echo


# Cleans all files and folders created as part of the build.
.PHONY: clean
clean:
	@echo "Cleaning up '$(output_folder)'."
	@rm -rf $(output_folder)
	@echo "Done cleanup."
	@echo

