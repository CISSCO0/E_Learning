'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import FileUpload from './fileupload';
import './ModulePage.css';
import { Module } from '../../moduleInterface';
import { Resource } from '../../resourcesInterface';
import { Progress } from '../progress.interface';

// Helper functions for data fetching
async function fetchModuleById(moduleId: string) {
  const res = await axios.get(`http://localhost:5000/modules/${moduleId}`, {
    withCredentials: true,
  });
  return res.data;
}

async function updateOutdatedFlag(resourceId: string, currentOutdatedStatus: boolean) {
  try {
    const ans = currentOutdatedStatus ? 'false' : 'true';
    const response = await axios.put(
      `http://localhost:5000/resources/${resourceId}/outdated`,
      { outdated: ans },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating outdated flag:', error);
    throw error;
  }
}

async function fetchNonOutdatedResources(moduleId: string) {
  const res = await axios.get(`http://localhost:5000/resources/${moduleId}/non-outdated`, {
    withCredentials: true,
  });
  return res.data;
}

async function fetchResourcesWithDownloadLinks(moduleId: string) {
  const res = await axios.get(`http://localhost:5000/resources/${moduleId}/with-download-links`, {
    withCredentials: true,
  });
  return res.data;
}

export default function ModulePage({ params }: { params: Promise<{ moduleid: string }> }) {
  const router = useRouter();
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [nonOutdatedResources, setNonOutdatedResources] = useState<Resource[]>([]);
  const [resourcesWithLinks, setResourcesWithLinks] = useState<Resource[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);

  // Set module ID from params
  useEffect(() => {
    params
      .then((resolvedParams) => setModuleId(resolvedParams.moduleid))
      .catch(() => setError('Error loading module ID.'));
  }, [params]);

  // Fetch module data
  useEffect(() => {
    if (!moduleId) return;

    async function fetchData() {
      try {
        const fetchedModule = await fetchModuleById(moduleId);
        setModule(fetchedModule);

        const role = await axios.get('http://localhost:5000/auth/role', { withCredentials: true });
        const nonOutdatedRes = await fetchNonOutdatedResources(moduleId);
        setNonOutdatedResources(nonOutdatedRes);

        if (role.data === 'instructor') {
          const resourcesWithLinksRes = await fetchResourcesWithDownloadLinks(moduleId);
          setResourcesWithLinks(resourcesWithLinksRes);
        }
      } catch (err) {
        console.error(err);
        setError('Error loading module or resources.');
      }
    }

    fetchData();
  }, [moduleId]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortResources = (resources: Resource[]) => {
    return [...resources].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };


  const handleSetOutdated = async (resourceId: string, currentOutdatedStatus: string) => {
    try {
      const newOutdatedStatus = currentOutdatedStatus === 'true' ? 'false' : 'true';
      await updateOutdatedFlag(resourceId, currentOutdatedStatus === 'true');
      setResourcesWithLinks((prev) =>
        prev.map((res) =>
          res._id === resourceId ? { ...res, outdated: newOutdatedStatus } : res
        )
      );
    } catch (err) {
      console.error('Error updating outdated status:', err);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!module) {
    return <div>Loading...</div>;
  }
  const navigateToQuizzes = () => {
    router.push(`${moduleId}/quizzes`);
  };

  const navigateToQuestionBank = () => {
    router.push(`${moduleId}/questionBank`);
  };
  return (
    <div className="module-container">
      <h1 className="module-title">{module.title}</h1>
      <p className="module-content">{module.content}</p>

      <button className="sort-button" onClick={() => navigateToQuizzes()}>
        Quizzes
      </button>
      <button className="sort-button" onClick={() => navigateToQuestionBank()}>
        Question Bank
      </button>

      <div className="module-resources-container">
        <h2>Module Resources</h2>
        <button onClick={toggleSortOrder} className="sort-button">
          Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>

        <h3>Student Resources</h3>
        <ul>
          {nonOutdatedResources.length > 0 ? (
            sortResources(nonOutdatedResources).map((res) => (
              <li key={res._id}>
                <p>Title: {res.fileName}</p>
                <p>Outdated: {res.outdated}</p>
                <button onClick={() => handleSetOutdated(res._id, res.outdated)}>
                  {res.outdated === 'true' ? 'Undo Outdated' : 'Set Outdated'}
                </button>
              </li>
            ))
          ) : (
            <p>No non-outdated resources available.</p>
          )}
        </ul>

        <FileUpload moduleId={moduleId as string} onUploadSuccess={(newRes) => {}} />
      </div>
    </div>
  );
}
