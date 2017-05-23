FROM ubuntu:16.10

MAINTAINER mattbudish

# port 9229 = node inspect, 80 = HTTP
EXPOSE 9229 80

# Set development environment as default
ENV NODE_ENV development

# Install Utilities
RUN apt-get update -q  \
  && apt-get install -yqq \
  sudo \
  curl \
  git \
  build-essential \
  python2.7 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Setup python
RUN ln -s /usr/bin/python2.7 /usr/bin/python

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install clang binaries
RUN curl -sL http://releases.llvm.org/4.0.0/clang+llvm-4.0.0-x86_64-linux-gnu-ubuntu-16.10.tar.xz | \
  tar xJ -C /usr/local --strip 1

RUN ldconfig

# Install node-libclang prerequisites
RUN npm install --quiet -g node-gyp

# Install node-libclang
RUN mkdir -p /opt/node-libclang
WORKDIR /opt/node-libclang
COPY package.json /opt/node-libclang/
RUN npm install --quiet && npm cache clean
COPY . /opt/node-libclang/

CMD bash